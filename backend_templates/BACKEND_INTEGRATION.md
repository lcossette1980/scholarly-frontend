# Backend Integration Instructions

## Step 1: Install Stripe SDK

```bash
cd backend
pip install stripe>=5.0.0
# Or add to requirements.txt:
echo "stripe>=5.0.0" >> requirements.txt
pip install -r requirements.txt
```

## Step 2: Add Environment Variable

```bash
# backend/.env
STRIPE_SECRET_KEY=sk_test_51...  # Start with test key

# For production later:
# STRIPE_SECRET_KEY=sk_live_51...
```

**Get Your Keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Secret key" (starts with `sk_test_`)
3. Later for production, use keys from https://dashboard.stripe.com/apikeys

## Step 3: Create Payment Endpoints File

```bash
# Create the file
cd backend/app/api
touch content_payment.py

# Copy the code from:
# frontend/backend_templates/content_payment.py
# Into: backend/app/api/content_payment.py
```

## Step 4: Register Router in Main App

**File:** `backend/app/main.py`

```python
# Add import at top
from app.api import content_payment

# Register router (add with your other routers)
app.include_router(content_payment.router, tags=["Content Payment"])
```

## Step 5: Update Your Generation Worker

**File:** Where you handle content generation (e.g., `backend/app/workers/content_generator.py`)

```python
from app.api.content_payment import refund_failed_job, RefundJobRequest

async def generate_content_job(job_id: str):
    """Your existing content generation function"""
    try:
        # Your existing generation logic
        content = await generate_with_gpt4(...)

        # Quality check before marking complete
        if not content or len(content.split()) < minimum_words:
            # AUTO-REFUND on failure
            await refund_failed_job(RefundJobRequest(
                job_id=job_id,
                reason="generation_failed_quality_check"
            ))
            raise Exception("Generation failed quality check - refunded")

        # Success path (no changes needed)
        update_job_status(job_id, 'completed', content)

    except OpenAIError as e:
        # API errors - AUTO-REFUND
        await refund_failed_job(RefundJobRequest(
            job_id=job_id,
            reason=f"api_error: {str(e)}"
        ))
        raise

    except Exception as e:
        # Any other error - AUTO-REFUND
        await refund_failed_job(RefundJobRequest(
            job_id=job_id,
            reason=f"unexpected_error: {str(e)}"
        ))
        raise
```

## Step 6: Test Endpoints

```bash
# Start your backend
cd backend
uvicorn app.main:app --reload

# Test create payment intent
curl -X POST http://localhost:8000/api/content/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "tier": "standard",
    "estimated_pages": 10,
    "job_metadata": {"source_ids": ["src1", "src2"]}
  }'

# Should return:
# {
#   "client_secret": "pi_xxx_secret_xxx",
#   "payment_intent_id": "pi_xxx",
#   "amount": 1490,
#   "currency": "usd"
# }
```

## Step 7: Verify Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. You should see "Payment Intents" being created
3. Metadata will show: user_id, tier, estimated_pages

## Database Schema Changes Needed

### Update Firestore: `content_generation_jobs` Collection

**Add these fields when creating jobs:**

```python
job_data = {
    # Existing fields (keep all of these)
    'userId': user_id,
    'sourceIds': source_ids,
    'outline': outline,
    'settings': settings,
    'tier': tier,
    'status': 'processing',
    'createdAt': firestore.SERVER_TIMESTAMP,

    # NEW: Payment tracking fields
    'payment_intent_id': payment_intent_id,  # Link to Stripe payment
    'payment_status': 'paid',  # 'paid' | 'refunded' | 'failed'
    'amount_paid': 14.90,  # Dollars
    'currency': 'usd',
    'stripe_customer_id': 'cus_xxx',  # For reference

    # NEW: Refund tracking (added when refunded)
    'refund_id': None,  # Set by refund endpoint
    'refund_amount': None,  # Set by refund endpoint
    'refund_reason': None,  # Set by refund endpoint
    'refundedAt': None,  # Set by refund endpoint
}
```

### Update Firestore: `users` Collection

**Add this field (auto-created on first payment):**

```python
{
    'uid': 'firebase_uid',
    'email': 'user@example.com',

    # NEW: Stripe customer ID (NOT card data)
    'stripe_customer_id': 'cus_xxx',  # Created automatically

    # Existing subscription field (unchanged)
    'subscription': {...}
}
```

## Testing with Stripe Test Cards

### In Stripe Test Mode

**Success:**
- Card: `4242 4242 4242 4242`
- Any future date, any CVC

**Decline:**
- Card: `4000 0000 0000 0002`

**Requires 3D Secure:**
- Card: `4000 0027 6000 3184`
- Will trigger authentication popup

**Insufficient Funds:**
- Card: `4000 0000 0000 9995`

### Full Test Flow

1. **Frontend:** User enters card `4242 4242 4242 4242`
2. **Backend:** Creates Payment Intent → Returns client_secret
3. **Frontend:** Stripe Elements processes payment
4. **Frontend:** Calls verify-and-create-job with payment_intent_id
5. **Backend:** Verifies with Stripe, creates job
6. **Worker:** Generates content OR calls refund if fails
7. **Check:** Go to https://dashboard.stripe.com/test/payments
   - Should see payment
   - If refunded, should see refund too

## Production Checklist

Before going live:

- [ ] Replace `sk_test_` with `sk_live_` in environment variable
- [ ] Update frontend `REACT_APP_STRIPE_PUBLISHABLE_KEY` to `pk_live_`
- [ ] Test with real card (small amount)
- [ ] Verify receipts arrive at email
- [ ] Test refund flow in live mode
- [ ] Enable Stripe webhooks for redundancy
- [ ] Set up Stripe radar for fraud detection
- [ ] Configure Stripe tax settings (if applicable)

## Stripe Dashboard Configuration

### 1. Customer Emails
Enable automatic receipts:
- Settings → Customer emails → Enable receipts ✓

### 2. Payment Methods
Enable desired payment methods:
- Settings → Payment methods → Enable cards ✓
- (Optional) Enable Google Pay, Apple Pay

### 3. Webhooks (Optional but Recommended)
For redundancy in case frontend fails:
- Developers → Webhooks → Add endpoint
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 4. Radar (Fraud Prevention)
Stripe Radar is automatically enabled - review:
- Radar → Rules → Review automatic fraud detection

## Support & Troubleshooting

### Common Issues

**"No such customer"**
- User's `stripe_customer_id` doesn't exist in Stripe
- Solution: Delete `stripe_customer_id` from Firestore, will auto-create

**"Payment Intent already confirmed"**
- Trying to confirm same payment twice
- Solution: Check for duplicate job before creating

**"Amount must be at least $0.50"**
- Calculated amount too low
- Solution: Minimum 1 page ($1.49)

### Debug Logging

Add logging to see what's happening:

```python
import logging
logger = logging.getLogger(__name__)

# In each endpoint:
logger.info(f"Creating payment intent for user {user_id}: {amount_cents} cents")
logger.info(f"Payment verified: {payment_intent.id}, status: {payment_intent.status}")
logger.info(f"Refund created: {refund.id} for job {job_id}")
```

### Stripe Logs

Check Stripe dashboard logs:
- Developers → Logs
- Shows all API calls with request/response

## Questions?

1. **Where do I find my Stripe keys?**
   - Test: https://dashboard.stripe.com/test/apikeys
   - Live: https://dashboard.stripe.com/apikeys

2. **How do I test refunds?**
   - Use test mode
   - Create payment with test card
   - Call refund endpoint
   - Check dashboard → should see refund

3. **Do I need to handle webhooks?**
   - Not required (our flow is sync)
   - Recommended for redundancy
   - Can add later if needed

4. **What about international customers?**
   - Stripe auto-converts to their currency
   - They pay in their currency, you receive USD
   - No code changes needed

5. **How do disputes work?**
   - Customer contacts bank → Stripe notifies you
   - Respond via Stripe dashboard
   - Stripe handles the process

---

**Next:** After backend is deployed, move to frontend implementation (Payment Modal & Service)
