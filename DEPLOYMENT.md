# Deployment Guide

## Vercel Deployment

### Setting Up Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables" tab
   - Add the following variables:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyDbwZkpRxosjn9SjKo99ssSjl8cjtl7C8M
REACT_APP_FIREBASE_AUTH_DOMAIN=scholarlyai-33fca.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=scholarlyai-33fca
REACT_APP_FIREBASE_STORAGE_BUCKET=scholarlyai-33fca.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=800076445479
REACT_APP_FIREBASE_APP_ID=1:800076445479:web:eac32e9b87b114a67c1b02
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ZBH0D3MR6T
REACT_APP_API_URL=https://scholarlyai-backend-production.up.railway.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51QoKdGKEqKU5U2BaF0YNuxU8xBDBqDQrJu51Gl0LnNBvtOLBCMl3yXNhjJBq5v97kVc0K2O7W9xlBGiZu2rL4xhO00v0tLN7eG
```

2. **Important:** Make sure to set these for all environments (Production, Preview, Development) if needed

3. **Redeploy:** After adding environment variables, trigger a new deployment for changes to take effect

### Quick Fix via Vercel CLI

If you have Vercel CLI installed:

```bash
vercel env add REACT_APP_FIREBASE_API_KEY production
# Paste the value when prompted
# Repeat for all variables
```

Then redeploy:
```bash
vercel --prod
```