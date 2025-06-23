# Security Configuration for ScholarlyAI

This document outlines the security measures implemented in the ScholarlyAI frontend application and provides guidance for proper deployment.

## 🔐 Firestore Security Rules

### Overview
The Firestore security rules are defined in `firestore.rules` and must be deployed to your Firebase project before launch.

### Deployment
```bash
# Deploy security rules to Firebase
firebase deploy --only firestore:rules
```

### Key Security Features

#### 1. User Data Protection
- Users can only access their own user documents
- User IDs cannot be modified after creation
- Subscription data is validated for proper structure and values
- Email and displayName are required fields

#### 2. Bibliography Entry Security
- Users can only access bibliography entries they own
- All CRUD operations are restricted to the document owner
- Entry structure is validated on creation
- User ID association cannot be changed after creation

#### 3. System Collections
- Admin collections are completely inaccessible from client-side
- Error logs and usage logs are write-only for clients
- Stripe webhook logs are server-side only
- Configuration is read-only for authenticated users

### Rule Validation

The security rules include several helper functions:

- `isAuthenticated()` - Ensures user is logged in
- `isOwner(userId)` - Verifies user owns the resource
- `isValidUserData()` - Validates user document structure
- `isValidSubscriptionData()` - Validates subscription data integrity
- `isValidBibliographyEntry()` - Ensures bibliography entries are properly formed

## 🛡️ Frontend Security Measures

### 1. Input Sanitization
All user inputs are sanitized using DOMPurify to prevent XSS attacks:

- Research focus input
- User display names
- Bibliography content display
- Search queries
- Form data

### 2. Environment Variable Validation
Critical environment variables are validated on startup:

**Required Variables:**
- `REACT_APP_API_URL`
- `REACT_APP_FIREBASE_*` (API key, auth domain, etc.)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`

**Optional Variables:**
- `REACT_APP_STRIPE_*_PRICE_ID` (subscription price IDs)
- `REACT_APP_SENTRY_DSN` (error monitoring)

### 3. Error Monitoring
Sentry integration provides:
- Error tracking and alerting
- Performance monitoring
- Session replay for debugging
- Filtered error reporting (excludes browser extensions, network errors)

### 4. Authentication Security
- Firebase Authentication with email verification
- Protected routes for authenticated content
- Secure logout and session management
- Google OAuth integration

## 🚨 Security Checklist for Production

### Before Launch:

- [ ] Deploy Firestore security rules: `firebase deploy --only firestore:rules`
- [ ] Verify all required environment variables are set
- [ ] Enable Firebase Authentication email verification
- [ ] Configure Stripe webhook endpoints with proper signatures
- [ ] Set up Sentry error monitoring
- [ ] Enable HTTPS enforcement on hosting platform
- [ ] Review and test all protected routes
- [ ] Validate input sanitization on all forms
- [ ] Test subscription flow and payment security
- [ ] Verify user data isolation in Firestore

### Security Headers
Configure these headers on your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.scholarlyaiapp.com https://*.firebase.com https://*.firebaseio.com https://api.stripe.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Firebase Configuration
1. **Authentication Settings:**
   - Enable email/password and Google providers only
   - Require email verification for new accounts
   - Set up proper authorized domains
   - Configure password policy (minimum 6 characters)

2. **Firestore Settings:**
   - Enable security rules (deploy from `firestore.rules`)
   - Set up backup schedule
   - Monitor security rule violations

3. **Storage Settings (if used):**
   - Configure proper CORS settings
   - Set up security rules for file uploads
   - Implement file size and type restrictions

## 📝 Environment Variables Template

Create a `.env` file with the following variables:

```env
# Firebase Configuration (Required)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# API Configuration (Required)
REACT_APP_API_URL=https://api.scholarlyaiapp.com

# Stripe Configuration (Required)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key_here

# Stripe Price IDs (Required for production)
REACT_APP_STRIPE_STUDENT_PRICE_ID=price_student_plan_id
REACT_APP_STRIPE_RESEARCHER_PRICE_ID=price_researcher_plan_id
REACT_APP_STRIPE_INSTITUTION_PRICE_ID=price_institution_plan_id

# Error Monitoring (Optional)
REACT_APP_SENTRY_DSN=your_sentry_dsn_here
REACT_APP_ENABLE_ERROR_MONITORING=true

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
REACT_APP_ENABLE_ANALYTICS=true
```

## 🔍 Security Monitoring

### Error Monitoring
- Monitor authentication failures
- Track payment processing errors
- Alert on unusual user activity patterns
- Log security rule violations

### Performance Security
- Monitor for unusual API usage patterns
- Track large file uploads
- Alert on excessive error rates
- Monitor subscription abuse

### User Security
- Enable account activity notifications
- Monitor for credential stuffing attempts
- Track failed login attempts
- Implement rate limiting on sensitive operations

## 📞 Security Incident Response

1. **Immediate Response:**
   - Disable affected user accounts if necessary
   - Revoke API keys if compromised
   - Deploy emergency security rule updates

2. **Investigation:**
   - Review Firestore security logs
   - Check Sentry error reports
   - Analyze authentication logs
   - Review payment transaction logs

3. **Communication:**
   - Notify affected users if data breach occurs
   - Update security documentation
   - Report to relevant authorities if required

## 🔄 Regular Security Maintenance

- **Weekly:** Review error logs and security alerts
- **Monthly:** Audit user permissions and access patterns
- **Quarterly:** Review and update security rules
- **Annually:** Complete security audit and penetration testing

---

**⚠️ Important:** Never commit sensitive environment variables to version control. Use Firebase CLI or your hosting platform's environment variable management for production deployments.