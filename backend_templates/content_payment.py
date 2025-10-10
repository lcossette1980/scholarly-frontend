# backend/app/api/content_payment.py
"""
Content Generation Payment Endpoints

Purpose: Handle Stripe Payment Intents for variable-priced content generation
Approach: Pay Before Generation with Auto-Refund on Failure

Security: All card data handled by Stripe (PCI compliant)
Pattern: Payment Intent → Verify → Create Job → Generate → Auto-Refund if Failed
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
import os
from typing import Optional, Dict, Any, List
from firebase_admin import firestore

router = APIRouter()
db = firestore.client()

# Initialize Stripe with secret key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CreatePaymentIntentRequest(BaseModel):
    """Request to create a Stripe Payment Intent for content generation"""
    user_id: str
    tier: str  # "standard" ($1.49/page) or "pro" ($2.49/page)
    estimated_pages: int
    job_metadata: Dict[str, Any]  # Contains source_ids, outline, settings

class VerifyAndCreateJobRequest(BaseModel):
    """Request to verify payment and create generation job"""
    payment_intent_id: str
    user_id: str
    source_ids: List[str]
    outline: Dict[str, Any]
    settings: Dict[str, Any]
    tier: str

class RefundJobRequest(BaseModel):
    """Request to refund a failed generation job"""
    job_id: str
    reason: str  # "generation_failed", "api_error", etc.

# ============================================================================
# ENDPOINT 1: CREATE PAYMENT INTENT
# ============================================================================

@router.post("/api/content/create-payment-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest):
    """
    Creates a Stripe Payment Intent for content generation.

    FLOW:
    1. Calculate amount based on tier and pages
    2. Get or create Stripe customer for user
    3. Create Payment Intent with metadata
    4. Return client_secret for frontend payment form

    WHY PAYMENT INTENTS:
    - Handles variable pricing ($14.90, $24.90, any amount)
    - Built-in fraud protection
    - Automatic 3D Secure when needed
    - Stripe manages all card data (we never see it)

    SECURITY:
    - All card data stays with Stripe (PCI compliant)
    - We only store stripe_customer_id (not sensitive)
    - Frontend gets client_secret (one-time use token)
    """
    try:
        # ===== STEP 1: Calculate Amount =====
        # Standard: $1.49/page, Pro: $2.49/page
        price_per_page = 1.49 if request.tier == "standard" else 2.49
        amount_dollars = price_per_page * request.estimated_pages
        amount_cents = int(amount_dollars * 100)  # Stripe uses cents

        # Stripe minimum charge is $0.50
        if amount_cents < 50:
            raise HTTPException(
                status_code=400,
                detail="Minimum charge is $0.50 (1 page minimum)"
            )

        # ===== STEP 2: Get or Create Stripe Customer =====
        # We store stripe_customer_id in Firestore (NO card data)
        user_ref = db.collection('users').document(request.user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user_doc.to_dict()
        stripe_customer_id = user_data.get('stripe_customer_id')

        # Create Stripe customer if doesn't exist
        if not stripe_customer_id:
            customer = stripe.Customer.create(
                email=user_data.get('email'),
                metadata={
                    'firebase_uid': request.user_id,
                    'source': 'content_generation'
                }
            )
            stripe_customer_id = customer.id

            # Save customer ID to Firestore (NOT card data)
            user_ref.update({
                'stripe_customer_id': stripe_customer_id
            })

        # ===== STEP 3: Create Payment Intent =====
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='usd',
            customer=stripe_customer_id,

            # Metadata for tracking and verification
            metadata={
                'user_id': request.user_id,
                'tier': request.tier,
                'estimated_pages': request.estimated_pages,
                'job_type': 'content_generation',
                'source_count': len(request.job_metadata.get('source_ids', [])),
            },

            # Description shown in Stripe dashboard and receipts
            description=f"Content Generation - {request.tier.title()} Tier ({request.estimated_pages} pages)",

            # Stripe sends receipt to this email automatically
            receipt_email=user_data.get('email'),

            # Let Stripe choose best payment method
            automatic_payment_methods={
                'enabled': True,
            }
        )

        # ===== STEP 4: Return client_secret =====
        return {
            'client_secret': payment_intent.client_secret,  # Frontend needs this
            'payment_intent_id': payment_intent.id,
            'amount': amount_cents,
            'currency': 'usd',
            'estimated_pages': request.estimated_pages,
            'tier': request.tier
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating payment intent: {str(e)}")


# ============================================================================
# ENDPOINT 2: VERIFY PAYMENT AND CREATE JOB
# ============================================================================

@router.post("/api/content/verify-and-create-job")
async def verify_and_create_job(request: VerifyAndCreateJobRequest):
    """
    Verifies payment succeeded with Stripe, then creates content generation job.

    CRITICAL SECURITY FLOW:
    1. Retrieve payment from Stripe (source of truth, NOT frontend)
    2. Verify status = 'succeeded'
    3. Verify user owns this payment (prevent fraud)
    4. Check for duplicate job (prevent double-processing)
    5. Create job with payment tracking
    6. Trigger content generation

    WHY THIS ORDER:
    - Stripe is source of truth (frontend can be manipulated)
    - Prevent fraud (user can't fake a payment)
    - Idempotent (safe to retry if network fails)
    - Link payment to job (enables refunds)

    CALLED BY:
    Frontend after payment succeeds in Stripe Elements form
    """
    try:
        # ===== STEP 1: Retrieve Payment from Stripe =====
        # CRITICAL: Get from Stripe, don't trust frontend data
        payment_intent = stripe.PaymentIntent.retrieve(request.payment_intent_id)

        # ===== STEP 2: Verify Payment Succeeded =====
        if payment_intent.status != 'succeeded':
            raise HTTPException(
                status_code=400,
                detail=f"Payment not completed. Status: {payment_intent.status}"
            )

        # ===== STEP 3: Verify User Owns Payment =====
        # Security: Prevent user A from using user B's payment
        if payment_intent.metadata.get('user_id') != request.user_id:
            raise HTTPException(
                status_code=403,
                detail="Unauthorized - payment belongs to different user"
            )

        # ===== STEP 4: Check for Duplicate Job =====
        # Idempotent: Safe to call multiple times (no duplicate charges)
        existing_jobs = db.collection('content_generation_jobs')\
            .where('payment_intent_id', '==', request.payment_intent_id)\
            .limit(1)\
            .get()

        if existing_jobs:
            # Job already exists, return it (idempotent response)
            job = existing_jobs[0]
            return {
                'job_id': job.id,
                'status': job.to_dict().get('status'),
                'message': 'Job already exists for this payment'
            }

        # ===== STEP 5: Create Job in Firestore =====
        job_data = {
            # Job configuration
            'userId': request.user_id,
            'sourceIds': request.source_ids,
            'outline': request.outline,
            'settings': request.settings,
            'tier': request.tier,

            # Payment tracking (for refunds and audit)
            'payment_intent_id': request.payment_intent_id,
            'payment_status': 'paid',
            'amount_paid': payment_intent.amount / 100,  # Convert cents to dollars
            'currency': payment_intent.currency,
            'stripe_customer_id': payment_intent.customer,

            # Job status
            'status': 'processing',
            'progress': 0,
            'createdAt': firestore.SERVER_TIMESTAMP,

            # Calculated fields
            'estimatedPages': int(payment_intent.metadata.get('estimated_pages', 0)),
            'estimatedCost': payment_intent.amount / 100
        }

        # Create job document
        job_ref = db.collection('content_generation_jobs').add(job_data)
        job_id = job_ref[1].id

        # ===== STEP 6: Trigger Content Generation =====
        # TODO: Call your async generation function here
        # Example: trigger_content_generation.delay(job_id)
        # This would be your existing GPT-4 generation logic

        return {
            'job_id': job_id,
            'status': 'processing',
            'message': 'Job created successfully, generation started'
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating job: {str(e)}")


# ============================================================================
# ENDPOINT 3: AUTO-REFUND FAILED GENERATION
# ============================================================================

@router.post("/api/content/refund-failed-job")
async def refund_failed_job(request: RefundJobRequest):
    """
    Auto-refunds a failed content generation job.

    WHEN TO CALL:
    - Generation fails after multiple retries
    - API errors that can't be recovered
    - Content quality below acceptable threshold
    - Any failure that wastes user's money

    WHY AUTO-REFUND:
    - Promised in UI: "100% refund if generation fails"
    - Builds user trust
    - Reduces support burden
    - Faster than manual review

    STRIPE REFUND BEHAVIOR:
    - Returns full amount to customer
    - Stripe processing fee also refunded to us
    - Instant for customers (shows immediately)
    - Takes 5-10 business days to appear on their card
    - Stripe sends automatic receipt email

    CALLED BY:
    Your generation job/worker when it detects failure
    """
    try:
        # ===== STEP 1: Get Job from Firestore =====
        job_ref = db.collection('content_generation_jobs').document(request.job_id)
        job_doc = job_ref.get()

        if not job_doc.exists:
            raise HTTPException(status_code=404, detail="Job not found")

        job_data = job_doc.to_dict()

        # ===== STEP 2: Check if Already Refunded =====
        # Idempotent: Safe to call multiple times
        if job_data.get('payment_status') == 'refunded':
            return {
                'already_refunded': True,
                'refund_id': job_data.get('refund_id'),
                'amount': job_data.get('refund_amount'),
                'message': 'Job already refunded'
            }

        # ===== STEP 3: Verify Job Was Paid =====
        payment_intent_id = job_data.get('payment_intent_id')
        if not payment_intent_id:
            raise HTTPException(
                status_code=400,
                detail="No payment found for this job (was it paid?)"
            )

        # ===== STEP 4: Create Refund in Stripe =====
        refund = stripe.Refund.create(
            payment_intent=payment_intent_id,
            reason='requested_by_customer',  # Stripe categorization
            metadata={
                'job_id': request.job_id,
                'reason': request.reason,
                'auto_refund': 'true',
                'refund_type': 'generation_failure'
            }
        )

        # ===== STEP 5: Update Job in Firestore =====
        job_ref.update({
            'payment_status': 'refunded',
            'refund_id': refund.id,
            'refund_amount': refund.amount / 100,
            'refund_reason': request.reason,
            'refundedAt': firestore.SERVER_TIMESTAMP,
            'status': 'failed_refunded'  # Clear status indicator
        })

        # Stripe automatically sends receipt email to customer

        return {
            'refunded': True,
            'refund_id': refund.id,
            'amount': refund.amount / 100,
            'currency': refund.currency,
            'message': f'Successfully refunded ${refund.amount / 100} to customer'
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing refund: {str(e)}")


# ============================================================================
# HELPER: Call Refund from Generation Worker
# ============================================================================

"""
EXAMPLE: How to call refund from your generation job/worker

async def generate_content_job(job_id: str):
    '''Your existing content generation function'''
    try:
        # Your generation logic
        content = await generate_with_gpt4(...)

        # Quality check
        if not content or len(content.split()) < settings['target_words'] * 0.8:
            # Content too short or missing
            await refund_failed_job(RefundJobRequest(
                job_id=job_id,
                reason="generation_failed_quality_check"
            ))
            raise Exception("Generation failed quality check")

        # Success - update job
        job_ref.update({
            'status': 'completed',
            'content': content,
            'completedAt': firestore.SERVER_TIMESTAMP
        })

    except OpenAIError as e:
        # API error after retries exhausted
        await refund_failed_job(RefundJobRequest(
            job_id=job_id,
            reason=f"api_error_{type(e).__name__}"
        ))
        raise

    except Exception as e:
        # Any other error
        await refund_failed_job(RefundJobRequest(
            job_id=job_id,
            reason=f"unexpected_error_{type(e).__name__}"
        ))
        raise
"""
