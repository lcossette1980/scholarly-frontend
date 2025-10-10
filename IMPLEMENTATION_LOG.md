# Stripe Content Generation Payment - Implementation Log

**Started:** 2025-01-10
**Decision:** Pay Before Generation with Auto-Refund
**Payment Method:** Stripe Payment Intents (variable pricing)

---

## Implementation Decisions

### ✅ Confirmed Decisions
1. **Pay Before Generation** - User pays upfront, auto-refund if generation fails
2. **No Payment Method Storage** - Stripe handles all card data (PCI compliant)
3. **Auto Receipts** - Stripe generates invoices/receipts automatically
4. **Variable Pricing** - Payment Intents for dynamic amounts ($1.49-$2.49/page)
5. **Auto-Refund Policy** - Immediate full refund if generation fails

### 🚫 What We're NOT Doing
- ❌ Not storing card data in Firestore
- ❌ Not saving payment methods for reuse (Stripe can do this via their portal)
- ❌ Not creating Stripe Products for every price point
- ❌ Not charging after generation (too complex, risk of unpaid content)

---

## Phase 1: Backend Implementation

### Step 1.1: Create Payment Intent Endpoint
**File:** `backend/app/api/content_payment.py` (create new file)

**Purpose:**
Creates a Stripe Payment Intent with the exact amount based on tier and page count. This is what generates the `client_secret` that the frontend uses to display the payment form.

**Why:**
- Payment Intents handle variable pricing (e.g., $14.90 for 10 pages)
- Stripe manages all card data securely
- We never touch sensitive payment information

**Implementation:**
```python
# backend/app/api/content_payment.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
import os
from typing import Optional, Dict, Any
from firebase_admin import firestore

router = APIRouter()
db = firestore.client()

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class CreatePaymentIntentRequest(BaseModel):
    user_id: str
    tier: str  # "standard" or "pro"
    estimated_pages: int
    job_metadata: Dict[str, Any]  # source_ids, outline, settings

@router.post("/api/content/create-payment-intent")
async def create_payment_intent(request: CreatePaymentIntentRequest):
    """
    Creates a Stripe Payment Intent for content generation.

    Flow:
    1. Calculate amount based on tier and pages
    2. Get or create Stripe customer for user
    3. Create Payment Intent with metadata
    4. Return client_secret for frontend

    Why Payment Intents:
    - Handles variable pricing elegantly
    - Built-in fraud protection
    - Automatic 3D Secure when needed
    - Stripe handles all card data (PCI compliant)
    """
    try:
        # Step 1: Calculate amount
        price_per_page = 1.49 if request.tier == "standard" else 2.49
        amount_dollars = price_per_page * request.estimated_pages
        amount_cents = int(amount_dollars * 100)  # Stripe uses cents

        if amount_cents < 50:  # Stripe minimum is $0.50
            raise HTTPException(400, "Minimum charge is $0.50")

        # Step 2: Get or create Stripe customer
        # We store stripe_customer_id in Firestore, but NO card data
        user_ref = db.collection('users').document(request.user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(404, "User not found")

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

        # Step 3: Create Payment Intent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency='usd',
            customer=stripe_customer_id,
            metadata={
                'user_id': request.user_id,
                'tier': request.tier,
                'estimated_pages': request.estimated_pages,
                'job_type': 'content_generation',
                # Store job details for later verification
                'source_count': len(request.job_metadata.get('source_ids', [])),
            },
            description=f"Content Generation - {request.tier.title()} Tier ({request.estimated_pages} pages)",
            # Stripe handles receipts automatically
            receipt_email=user_data.get('email'),
            # Enable automatic payment methods (Stripe decides card vs other methods)
            automatic_payment_methods={
                'enabled': True,
            }
        )

        return {
            'client_secret': payment_intent.client_secret,
            'payment_intent_id': payment_intent.id,
            'amount': amount_cents,
            'currency': 'usd',
            'estimated_pages': request.estimated_pages,
            'tier': request.tier
        }

    except stripe.error.StripeError as e:
        raise HTTPException(400, f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Error creating payment intent: {str(e)}")
```

**What This Does:**
1. Calculates exact price (e.g., 10 pages × $1.49 = $14.90 = 1490 cents)
2. Gets user's Stripe customer ID (creates if needed) - NO card data stored
3. Creates Payment Intent with all job metadata
4. Returns `client_secret` for frontend to show payment form
5. Stripe automatically sends receipt to user's email

**Security:**
- ✅ All card data stays with Stripe (PCI compliant)
- ✅ We only store customer ID (not sensitive)
- ✅ Payment Intent metadata for verification
- ✅ Automatic fraud detection by Stripe

---

### Step 1.2: Verify Payment and Create Job Endpoint
**File:** `backend/app/api/content_payment.py` (same file, add this)

**Purpose:**
After user completes payment in the frontend, verify it succeeded with Stripe, then create the content generation job.

**Why:**
- Must verify payment actually succeeded (never trust frontend)
- Prevent duplicate charges (check if job already exists)
- Link payment to job for refund purposes
- Only create job after confirmed payment

**Implementation:**
```python
class VerifyAndCreateJobRequest(BaseModel):
    payment_intent_id: str
    user_id: str
    source_ids: list[str]
    outline: Dict[str, Any]
    settings: Dict[str, Any]
    tier: str

@router.post("/api/content/verify-and-create-job")
async def verify_and_create_job(request: VerifyAndCreateJobRequest):
    """
    Verifies payment succeeded, then creates content generation job.

    Critical Security Flow:
    1. Retrieve payment from Stripe (source of truth)
    2. Verify status = 'succeeded'
    3. Verify user owns this payment
    4. Check for duplicate job (prevent double-processing)
    5. Create job with payment tracking
    6. Trigger generation

    Why this order:
    - Stripe is source of truth, not frontend
    - Prevent fraud (user can't fake payment)
    - Idempotent (safe to retry if network fails)
    """
    try:
        # Step 1: Retrieve payment from Stripe (DON'T trust frontend)
        payment_intent = stripe.PaymentIntent.retrieve(request.payment_intent_id)

        # Step 2: Verify payment actually succeeded
        if payment_intent.status != 'succeeded':
            raise HTTPException(400, f"Payment not completed. Status: {payment_intent.status}")

        # Step 3: Verify user owns this payment (security!)
        if payment_intent.metadata.get('user_id') != request.user_id:
            raise HTTPException(403, "Unauthorized - payment belongs to different user")

        # Step 4: Check if job already exists (prevent duplicate processing)
        existing_jobs = db.collection('content_generation_jobs')\
            .where('payment_intent_id', '==', request.payment_intent_id)\
            .limit(1)\
            .get()

        if existing_jobs:
            # Job already created, return it (idempotent)
            job = existing_jobs[0]
            return {
                'job_id': job.id,
                'status': job.get('status'),
                'message': 'Job already exists for this payment'
            }

        # Step 5: Create job in Firestore with payment tracking
        job_data = {
            'userId': request.user_id,
            'sourceIds': request.source_ids,
            'outline': request.outline,
            'settings': request.settings,
            'tier': request.tier,

            # Payment tracking fields (for refunds)
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
            'estimatedPages': payment_intent.metadata.get('estimated_pages'),
            'estimatedCost': payment_intent.amount / 100
        }

        # Create job document
        job_ref = db.collection('content_generation_jobs').add(job_data)
        job_id = job_ref[1].id

        # Step 6: Trigger async content generation
        # (Your existing generation logic here)
        # This would call your GPT-4 generation function
        # Example: trigger_content_generation.delay(job_id)

        return {
            'job_id': job_id,
            'status': 'processing',
            'message': 'Job created successfully, generation started'
        }

    except stripe.error.StripeError as e:
        raise HTTPException(400, f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Error creating job: {str(e)}")
```

**What This Does:**
1. **Retrieves payment from Stripe** (source of truth, not frontend)
2. **Verifies status = succeeded** (payment actually went through)
3. **Verifies ownership** (prevent user A from using user B's payment)
4. **Checks for duplicates** (safe to retry if frontend crashes)
5. **Creates job with payment info** (links payment to content)
6. **Triggers generation** (your existing GPT logic)

**Why This Matters:**
- 🔒 **Security**: Never trust frontend - Stripe is source of truth
- 🔄 **Idempotent**: Safe to call multiple times (no duplicates)
- 💰 **Refund Ready**: We know payment_intent_id for refunds
- 📊 **Audit Trail**: Full payment history in Firestore

---

### Step 1.3: Auto-Refund Endpoint for Failed Generations
**File:** `backend/app/api/content_payment.py` (same file, add this)

**Purpose:**
Automatically refund user if content generation fails. This is called by your generation job when it detects a failure.

**Why:**
- Promised auto-refund in UI ("100% refund if generation fails")
- Better UX than manual review
- Builds trust with users
- Prevents support tickets

**Implementation:**
```python
class RefundJobRequest(BaseModel):
    job_id: str
    reason: str  # "generation_failed", "quality_issue", etc.

@router.post("/api/content/refund-failed-job")
async def refund_failed_job(request: RefundJobRequest):
    """
    Auto-refunds a failed content generation job.

    When to call:
    - Generation fails after multiple retries
    - API errors that can't be recovered
    - Content quality below acceptable threshold

    Why auto-refund:
    - Promised in UI: "100% refund if generation fails"
    - Builds user trust
    - Reduces support burden
    - Faster than manual review

    Stripe refund behavior:
    - Returns full amount to customer
    - Stripe fee is also refunded to us
    - Instant for customers
    - Usually 5-10 business days to card
    """
    try:
        # Step 1: Get job from Firestore
        job_ref = db.collection('content_generation_jobs').document(request.job_id)
        job_doc = job_ref.get()

        if not job_doc.exists:
            raise HTTPException(404, "Job not found")

        job_data = job_doc.to_dict()

        # Step 2: Check if already refunded (idempotent)
        if job_data.get('payment_status') == 'refunded':
            return {
                'already_refunded': True,
                'refund_id': job_data.get('refund_id'),
                'message': 'Job already refunded'
            }

        # Step 3: Verify job was actually paid
        payment_intent_id = job_data.get('payment_intent_id')
        if not payment_intent_id:
            raise HTTPException(400, "No payment found for this job")

        # Step 4: Create refund in Stripe
        refund = stripe.Refund.create(
            payment_intent=payment_intent_id,
            reason='requested_by_customer',  # Stripe categorization
            metadata={
                'job_id': request.job_id,
                'reason': request.reason,
                'auto_refund': 'true'
            }
        )

        # Step 5: Update job in Firestore
        job_ref.update({
            'payment_status': 'refunded',
            'refund_id': refund.id,
            'refund_amount': refund.amount / 100,
            'refund_reason': request.reason,
            'refundedAt': firestore.SERVER_TIMESTAMP,
            'status': 'failed_refunded'  # Clear status
        })

        # Step 6: Send notification email (optional)
        # You can use Stripe's built-in receipt or send custom email

        return {
            'refunded': True,
            'refund_id': refund.id,
            'amount': refund.amount / 100,
            'currency': refund.currency,
            'message': f'Successfully refunded ${refund.amount / 100} to customer'
        }

    except stripe.error.StripeError as e:
        raise HTTPException(400, f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Error processing refund: {str(e)}")
```

**What This Does:**
1. **Gets job from Firestore** (need payment_intent_id)
2. **Checks if already refunded** (safe to retry)
3. **Creates Stripe refund** (full amount automatically)
4. **Updates job status** (payment_status = 'refunded')
5. **Stripe emails receipt** (automatic)

**When To Call:**
```python
# In your generation job/worker:
try:
    content = generate_with_gpt4(...)
    if not content or len(content) < minimum_words:
        # Generation failed
        await refund_failed_job(job_id, "generation_failed")
except Exception as e:
    # API error, retry exhausted
    await refund_failed_job(job_id, f"api_error: {str(e)}")
```

**Refund Facts:**
- ⚡ Instant for customer (shows immediately)
- 💳 Takes 5-10 days to appear on card (Stripe/bank timing)
- 💰 Stripe refunds their fee too (we get fee back)
- 📧 Customer gets automatic receipt

---

## Backend Files to Create/Modify

### New Files
```
backend/
├── app/
│   ├── api/
│   │   ├── content_payment.py          # NEW - All 3 endpoints above
│   │   └── __init__.py                 # Import new router
```

### Existing Files to Modify
```
backend/
├── app/
│   ├── main.py                         # Add router: app.include_router(content_payment.router)
│   └── requirements.txt                # Add: stripe>=5.0.0
```

### Environment Variables to Add
```bash
# backend/.env
STRIPE_SECRET_KEY=sk_test_xxx   # Use test key first, then sk_live_xxx
```

---

## Next Steps (Phase 2 - Frontend)

After backend is deployed:
1. Create `contentPayment.js` service
2. Create `PaymentModal.js` component
3. Update `PricingConfirmationStep.js`
4. Test end-to-end with Stripe test cards

---

## Testing with Stripe Test Mode

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
Insufficient funds: 4000 0000 0000 9995
```

### Test Flow
1. Create payment intent → Should return client_secret
2. Use test card in frontend → Payment succeeds
3. Verify job created → Check Firestore
4. Simulate failure → Refund should process
5. Check Stripe dashboard → See payment & refund

---

## Why This Approach is Best

### ✅ Security
- Stripe handles all card data (PCI compliant)
- We never see or store card numbers
- Payment verification on backend (can't be faked)

### ✅ User Experience
- Pay before = simple, predictable
- Auto-refund = builds trust
- Stripe receipts = professional

### ✅ Business
- No unpaid content (payment first)
- Automatic refunds (less support)
- Stripe handles disputes
- Clean audit trail

### ✅ Technical
- Payment Intents = flexible pricing
- Idempotent endpoints = safe retries
- Metadata tracking = full context
- Minimal code = maintainable
