# Deployment Guide

## Vercel Deployment

### Setting Up Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables" tab
   - Add the following variables:

```
REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=<your-project-id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your-project-id>.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
REACT_APP_FIREBASE_APP_ID=<your-app-id>
REACT_APP_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
REACT_APP_API_URL=<your-backend-api-url>
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

**Note:** Replace the placeholders above with your actual values from:
- Firebase Console → Project Settings
- Stripe Dashboard → API Keys
- Your deployed backend URL

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