# Stripe Content Generation Payment Implementation Plan

## Current State Analysis

### What Works Now
- ✅ **Subscriptions**: Working perfectly with recurring billing (Student $9.99, Researcher $19.99)
- ✅ **Job Creation**: Content generation jobs are created and tracked in Firestore
- ✅ **Generation Flow**: 6-step process from source selection to content display
- ✅ **Pricing Display**: Shows Standard ($1.49/page) and Pro ($2.49/page) with estimates

### What's Missing
- ❌ **Payment Collection**: No actual payment happens - users can see content for free
- ❌ **Content Access Control**: Generated content is immediately visible
- ❌ **Stripe Integration**: No payment method collection or charge

---

## Proposed Solution: Stripe Payment Intents

### Why Payment Intents (Not Products)?

**Payment Intents** are perfect for variable-price, one-time payments:
- ✅ Create dynamic amounts based on word count/pages
- ✅ Charge exact calculated price (e.g., $14.90 for 10 pages)
- ✅ No need to create products for every possible price
- ✅ Support for payment method storage and reuse
- ✅ Built-in fraud protection and 3D Secure

**Not Using Products** because:
- ❌ Would need hundreds of products (one for each possible price)
- ❌ Overkill for simple one-time charges
- ❌ Variable pricing is cumbersome with products

---

## Payment Flow Architecture

### Option A: Pay After Generation (Current UI Messaging)
**"You'll be charged only after your content is successfully generated"**

```
1. User configures settings (sources, outline, word count, tier)
2. User sees pricing estimate and clicks "Start Generation - $14.90"
3. ✅ Job created in Firestore (status: 'pending_payment')
4. ⏳ Content generation happens (2-5 minutes)
5. ✅ Generation completes (status: 'completed_unpaid')
6. 🔒 PAYMENT GATE - User sees payment modal
   - "Your content is ready! Pay $14.90 to view"
   - Stripe Elements payment form appears
   - User enters payment method
7. 💳 Payment Intent created and charged
8. ✅ Payment succeeds (status: 'completed')
9. 🎉 Content unlocked and displayed
```

**Pros:**
- User only pays if generation succeeds
- Better UX - no upfront cost for potential failures
- Matches current messaging

**Cons:**
- User could close tab after generation (content generated, not paid)
- More complex state management
- Need to handle abandoned jobs

---

### Option B: Pay Before Generation (Recommended)
**Change messaging to: "Pay $14.90 to start generation"**

```
1. User configures settings (sources, outline, word count, tier)
2. User sees pricing estimate and clicks "Pay & Generate - $14.90"
3. 💳 PAYMENT GATE - Stripe payment form appears immediately
   - Stripe Elements payment method collection
   - Payment Intent created
   - User enters card and submits
4. ✅ Payment authorized/charged
5. ✅ Job created in Firestore (status: 'processing', payment_intent_id: 'pi_xxx')
6. ⏳ Content generation happens
7. ✅ Generation completes (status: 'completed')
8. 🎉 Content displayed immediately
```

**Pros:**
- ✅ Simpler implementation
- ✅ No abandoned unpaid content
- ✅ Payment guaranteed before spending API costs
- ✅ Standard e-commerce pattern
- ✅ Can offer refund if generation fails

**Cons:**
- User pays upfront (but can refund if fails)

---

## Recommended Approach: **Option B (Pay Before)**

---

## Technical Implementation Plan

### Phase 1: Backend API Endpoints (Python/FastAPI)

#### 1.1 Create Payment Intent Endpoint
```python
# POST /api/content/create-payment-intent
Request Body:
{
  "user_id": "firebase_uid",
  "tier": "standard" or "pro",
  "estimated_pages": 10,
  "job_metadata": {
    "source_ids": [...],
    "outline": {...},
    "settings": {...}
  }
}

Response:
{
  "client_secret": "pi_xxx_secret_xxx",
  "payment_intent_id": "pi_xxx",
  "amount": 1490,  // cents
  "currency": "usd"
}
```

**Implementation:**
```python
import stripe

@app.post("/api/content/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    # Calculate amount
    price_per_page = 1.49 if request.tier == "standard" else 2.49
    amount_dollars = price_per_page * request.estimated_pages
    amount_cents = int(amount_dollars * 100)

    # Get or create Stripe customer
    user_doc = db.collection('users').document(request.user_id).get()
    stripe_customer_id = user_doc.get('stripe_customer_id')

    if not stripe_customer_id:
        customer = stripe.Customer.create(
            metadata={'firebase_uid': request.user_id}
        )
        stripe_customer_id = customer.id
        # Save to Firestore
        db.collection('users').document(request.user_id).update({
            'stripe_customer_id': stripe_customer_id
        })

    # Create Payment Intent
    payment_intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency='usd',
        customer=stripe_customer_id,
        metadata={
            'user_id': request.user_id,
            'tier': request.tier,
            'estimated_pages': request.estimated_pages,
            'job_type': 'content_generation'
        },
        description=f"Content Generation - {request.tier.title()} Tier"
    )

    return {
        'client_secret': payment_intent.client_secret,
        'payment_intent_id': payment_intent.id,
        'amount': amount_cents,
        'currency': 'usd'
    }
```

#### 1.2 Verify Payment and Create Job Endpoint
```python
# POST /api/content/verify-and-create-job
Request Body:
{
  "payment_intent_id": "pi_xxx",
  "user_id": "firebase_uid",
  "source_ids": [...],
  "outline": {...},
  "settings": {...},
  "tier": "standard"
}

Response:
{
  "job_id": "job_xxx",
  "status": "processing"
}
```

**Implementation:**
```python
@app.post("/api/content/verify-and-create-job")
async def verify_and_create_job(request: CreateJobRequest):
    # Verify payment succeeded
    payment_intent = stripe.PaymentIntent.retrieve(request.payment_intent_id)

    if payment_intent.status != 'succeeded':
        raise HTTPException(400, "Payment not completed")

    # Verify user owns this payment
    if payment_intent.metadata.get('user_id') != request.user_id:
        raise HTTPException(403, "Unauthorized")

    # Check if job already created (prevent double-processing)
    existing_jobs = db.collection('content_generation_jobs')\
        .where('payment_intent_id', '==', request.payment_intent_id)\
        .get()

    if existing_jobs:
        return {'job_id': existing_jobs[0].id, 'status': existing_jobs[0].get('status')}

    # Create job in Firestore
    job_data = {
        'userId': request.user_id,
        'sourceIds': request.source_ids,
        'outline': request.outline,
        'settings': request.settings,
        'tier': request.tier,
        'status': 'processing',
        'payment_intent_id': request.payment_intent_id,
        'payment_status': 'paid',
        'amount_paid': payment_intent.amount / 100,
        'createdAt': firestore.SERVER_TIMESTAMP
    }

    job_ref = db.collection('content_generation_jobs').add(job_data)

    # Trigger generation (async)
    # Your existing generation logic here

    return {
        'job_id': job_ref[1].id,
        'status': 'processing'
    }
```

#### 1.3 Refund Endpoint (For Failed Generations)
```python
# POST /api/content/refund-failed-job
Request Body:
{
  "job_id": "job_xxx",
  "reason": "generation_failed"
}

Response:
{
  "refunded": true,
  "refund_id": "re_xxx",
  "amount": 1490
}
```

---

### Phase 2: Frontend Integration

#### 2.1 Create Payment Service
```javascript
// src/services/contentPayment.js

export const createPaymentIntent = async (userId, tier, estimatedPages, jobMetadata) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const response = await fetch(`${apiUrl}/api/content/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      tier,
      estimated_pages: estimatedPages,
      job_metadata: jobMetadata
    })
  });

  if (!response.ok) throw new Error('Failed to create payment intent');

  return await response.json();
};

export const verifyAndCreateJob = async (paymentIntentId, userId, sourceIds, outline, settings, tier) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const response = await fetch(`${apiUrl}/api/content/verify-and-create-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_intent_id: paymentIntentId,
      user_id: userId,
      source_ids: sourceIds,
      outline,
      settings,
      tier
    })
  });

  if (!response.ok) throw new Error('Failed to create job');

  return await response.json();
};
```

#### 2.2 Create Payment Modal Component
```javascript
// src/components/contentGeneration/PaymentModal.js

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Lock, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ clientSecret, onSuccess, onError, totalCost, tier }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Fallback, we handle it manually
      },
      redirect: 'if_required'
    });

    if (error) {
      onError(error.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-charcoal">${totalCost}</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {tier === 'pro' ? 'Professional' : 'Standard'} Tier
        </div>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-2"
      >
        {loading ? (
          <span>Processing...</span>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay ${totalCost} Securely</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        🔒 Secured by Stripe. Your payment information is encrypted.
      </p>
    </form>
  );
};

const PaymentModal = ({ isOpen, onClose, clientSecret, onSuccess, onError, totalCost, tier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-chestnut rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-charcoal font-playfair">
              Complete Payment
            </h2>
            <p className="text-sm text-gray-600">
              To start content generation
            </p>
          </div>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onError={onError}
            totalCost={totalCost}
            tier={tier}
          />
        </Elements>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 hover:text-gray-800 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
```

#### 2.3 Update PricingConfirmationStep.js
```javascript
// Modify handleConfirmAndPay in PricingConfirmationStep.js

const handleConfirmAndPay = async () => {
  try {
    setLoading(true);

    // Step 1: Create Payment Intent
    const paymentData = await createPaymentIntent(
      currentUser.uid,
      selectedTier,
      estimatedPages,
      {
        source_ids: selectedSources.map(s => s.id),
        outline,
        settings
      }
    );

    // Step 2: Show payment modal
    setPaymentClientSecret(paymentData.client_secret);
    setPaymentIntentId(paymentData.payment_intent_id);
    setShowPaymentModal(true);

  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to initialize payment');
    setLoading(false);
  }
};

const handlePaymentSuccess = async (confirmedPaymentIntentId) => {
  try {
    setShowPaymentModal(false);
    toast.success('Payment successful! Starting generation...');

    // Step 3: Verify payment and create job
    const response = await verifyAndCreateJob(
      confirmedPaymentIntentId,
      currentUser.uid,
      selectedSources.map(s => s.id),
      outline,
      settings,
      selectedTier
    );

    setJobId(response.job_id);
    onNext(); // Move to generation progress step

  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to start generation. Contact support for refund.');
  } finally {
    setLoading(false);
  }
};
```

---

### Phase 3: Database Schema Updates

#### Firestore: `content_generation_jobs` Collection
```javascript
{
  id: "job_xxx",
  userId: "firebase_uid",
  sourceIds: ["entry_1", "entry_2"],
  outline: {...},
  settings: {...},
  tier: "standard" | "pro",

  // Payment fields (NEW)
  payment_intent_id: "pi_xxx",
  payment_status: "paid" | "refunded" | "failed",
  amount_paid: 14.90,
  amount_refunded: 0,
  currency: "usd",

  // Existing fields
  status: "processing" | "completed" | "failed",
  content: "...",
  wordCount: 3500,
  estimatedPages: 14,
  estimatedCost: 14.90,
  createdAt: Timestamp,
  completedAt: Timestamp
}
```

#### Firestore: `users` Collection (Add Stripe Customer ID)
```javascript
{
  uid: "firebase_uid",
  email: "user@example.com",

  // Add this field
  stripe_customer_id: "cus_xxx",

  // Existing subscription field
  subscription: {...}
}
```

---

### Phase 4: Error Handling & Edge Cases

#### 4.1 Payment Failed
```
User clicks "Pay & Generate" → Payment fails
- Show error message
- Allow retry
- Don't create job
```

#### 4.2 Generation Failed After Payment
```
Payment succeeded → Generation fails
- Automatically trigger refund
- Update job status to 'failed_refunded'
- Send email notification
- Show refund confirmation in UI
```

#### 4.3 User Closes Tab During Payment
```
Payment Intent created → User closes tab
- Payment Intent expires after 24 hours (Stripe default)
- No charge occurs
- Clean up abandoned payment intents via cron job
```

#### 4.4 Duplicate Payment Prevention
```
- Store payment_intent_id in job
- Check if job exists for payment_intent_id before creating
- Return existing job if found
```

---

### Phase 5: Testing Checklist

- [ ] Create payment intent
- [ ] Payment form displays correctly
- [ ] Successful payment flow
- [ ] Failed payment flow
- [ ] Card declined handling
- [ ] 3D Secure authentication
- [ ] Refund for failed generation
- [ ] Duplicate payment prevention
- [ ] Webhook receives payment_intent.succeeded
- [ ] Test with Stripe test cards

---

## Implementation Timeline

### Week 1: Backend
- [ ] Day 1-2: Create payment intent endpoint
- [ ] Day 2-3: Verify and create job endpoint
- [ ] Day 3-4: Refund endpoint
- [ ] Day 4-5: Testing with Stripe test mode

### Week 2: Frontend
- [ ] Day 1-2: Payment service functions
- [ ] Day 2-3: Payment modal component
- [ ] Day 3-4: Update PricingConfirmationStep
- [ ] Day 4-5: Integration testing

### Week 3: Polish & Deploy
- [ ] Day 1-2: Error handling & edge cases
- [ ] Day 2-3: UI polish & loading states
- [ ] Day 3-4: End-to-end testing
- [ ] Day 4-5: Production deployment

---

## Environment Variables Needed

### Frontend (.env)
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # or pk_test_xxx for testing
```

### Backend (.env)
```bash
STRIPE_SECRET_KEY=sk_live_xxx  # or sk_test_xxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxx  # For webhook signature verification
```

---

## Cost Considerations

### Stripe Fees
- 2.9% + $0.30 per successful transaction
- Example: $14.90 charge = $0.73 fee = $14.17 net

### Refund Policy
- Full refund if generation fails
- Stripe refund fee: None (they return the processing fee too)
- Communicate clearly: "100% refund if generation fails"

---

## Security Considerations

1. **Never expose Stripe Secret Key** to frontend
2. **Validate user owns payment** in backend before creating job
3. **Use HTTPS** only (Stripe requires it)
4. **Verify webhook signatures** to prevent fake events
5. **Store minimal PII** - Stripe handles card data
6. **Implement rate limiting** on payment endpoints

---

## Future Enhancements

- [ ] Save payment methods for faster checkout
- [ ] Offer discounts for bulk purchases
- [ ] Implement payment plans for expensive generations
- [ ] Add invoice generation and receipts via email
- [ ] Implement referral credits

---

## Questions to Answer Before Implementation

1. **Do we want to save payment methods for returning users?**
   - Pro: Faster checkout
   - Con: Requires additional UI and compliance

2. **What's our refund window?**
   - Immediate auto-refund on failure? (Recommended)
   - Manual review? (More complex)

3. **Do we need invoices/receipts?**
   - Stripe can generate these automatically
   - Need to configure in Stripe dashboard

4. **Should we support international currencies?**
   - Start with USD only
   - Expand later if needed

---

## Success Metrics

- Payment success rate > 95%
- Refund rate < 5%
- Average payment flow time < 60 seconds
- Zero unauthorized charges
- User satisfaction with payment UX

---

## Resources

- [Stripe Payment Intents Docs](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements React](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing Cards](https://stripe.com/docs/testing)
