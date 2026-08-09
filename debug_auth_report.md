# AXEVORA - Final Authentication Root Cause Report

## 1. Complete Pipeline Trace & Failure Analysis

### Flow 1: Email Signup
- **Function:** `handleSignup` (`Community.tsx:275`)
- **Trace:**
  1. Frontend calls `createUserWithEmailAndPassword`.
  2. Frontend sends `POST /api/community/auth/signup` with `firebaseIdToken`.
  3. Backend (`signup.ts`) creates the user in D1 with `email_verified = 0`.
  4. Backend returns `201 Created` with `requireVerification: true` and **NO SESSION COOKIE** (`signup.ts:144`).
  5. Frontend receives response, calls Firebase's `sendEmailVerification(userCredential.user)`.
  6. Frontend calls `await signOut(auth)` and forces the user to the login screen.
- **Possible Failure Conditions:** 
  - Firebase silently drops the verification email due to Spark Plan quota or localhost spam protection.
  - User closes the tab before receiving the email.

### Flow 2: Google Login
- **Function:** `handleGoogleAuth` (`Community.tsx:388`)
- **Trace:**
  1. Frontend sets `ax_google_redirect = '1'` in sessionStorage.
  2. Frontend calls `signInWithRedirect(auth, googleProvider)`.
  3. Browser redirects to Google, authenticates, and redirects back.
  4. `AuthContext.tsx` detects `ax_google_redirect = '1'` and awaits `getRedirectResult(auth)`.
  5. Frontend sends `POST /api/community/auth/login` with `firebaseIdToken`.
  6. Backend (`login.ts:42`) verifies token. Since Google verifies email natively, `fbUser.emailVerified` is `true`.
  7. Backend syncs user to D1, generates a session cookie (`login.ts:138`).
  8. Frontend clears `ax_google_redirect` and calls `checkAuth()`.
  9. `checkAuth` calls `GET /api/community/auth/me`. Cookie is sent (Same-Origin). Backend returns `200 OK` and user state.
- **Possible Failure Conditions:** 
  - Browser blocks third-party cookies (Safari/Brave), causing `getRedirectResult` to return `null`. (Not the current blocker).

---

## 2. EXACT FAILING FUNCTION & CATCH-22 LOCKOUT

**Exact Failing Function:** `onRequestPost`
**Exact File:** `functions/api/community/auth/resend-verification.ts`
**Exact Line:** 16-19

**Exact Reason:**
The application has a severe architectural flaw creating a permanent Catch-22 lockout:
1. When a user signs up, Firebase fails to deliver the verification email (due to localhost/Spark plan limits).
2. The user tries to use the "Resend Verification Email" feature.
3. However, `resend-verification.ts` (Line 16) **REQUIRES** `getAuthenticatedUser(request, db)` to return a valid session.
4. `getAuthenticatedUser` requires a valid session cookie.
5. The backend explicitly **REFUSES** to issue a session cookie in both `signup.ts` and `login.ts` if the email is not verified.
6. Because the user has no cookie, the resend endpoint returns `401 Unauthorized`.
7. Because they can't resend, they can't verify. Because they can't verify, they can't login. Because they can't login, they can't resend.

**Status:** PERMANENT LOCKOUT.

---

## 3. Permanent Code Fix

To solve this, we must completely bypass Firebase's unreliable email delivery and the Catch-22 cookie requirement:

1. **Modify `signup.ts`**: Generate a custom Resend verification token and send the email *immediately* during backend signup using our custom `sendVerificationEmail` function.
2. **Modify `resend-verification.ts`**: Allow resending emails using the `firebaseIdToken` instead of a session cookie, so a user who just authenticated via Firebase (even if unverified) can trigger a resend.
3. **Modify `login.ts`**: If verification fails, return a specific error code so the frontend can prompt the user to resend.

I am ready to implement these 3 exact fixes. Please approve this plan.
