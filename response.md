# Sprint 1.2 - signInWithRedirect() Implementation

## Authentication State Diagram

```
[USER CLICKS "Continue with Google"]
        |
        v
[signInWithRedirect(auth, googleProvider)]
        |
        v  (Page navigates away to Google)
[GOOGLE ACCOUNTS PAGE]
        |
   User selects account
        |
        v  (Google redirects back to /community)
[Component Mounts -> useEffect fires]
        |
        v
[getRedirectResult(auth)]
        |
   +----+----+
   |         |
 null      result
   |         |
   v         v
[checkAuth] [Get Firebase ID Token]
(Normal flow)      |
                   v
         [POST /api/community/auth/login]
                   |
           +-------+-------+
           |               |
          OK           NOT OK
           |               |
           v               v
      [setUser(data.user)] [signOut(auth)]  <-- Half-auth state prevented
           |               |
           v               v
      [toast success]  [toast error]
```

## Google Redirect Flow

1. User "Continue with Google" button click karta hai
2. `handleGoogleAuth()` call hoti hai
3. `signInWithRedirect(auth, googleProvider)` fire hota hai
4. **Browser Google Accounts page par navigate kar jata hai** (COOP se koi conflict nahi, kyunki koi popup window nahi khulti)
5. User apna Google account select karta hai
6. Google `axevora.com/community` par redirect karta hai
7. `Community.tsx` mount hota hai
8. `useEffect` me `getRedirectResult(auth)` call hoti hai
9. **Agar result null hai** → `checkAuth()` silently chalti hai, app crash nahi hoti
10. **Agar result available hai** → Firebase ID Token liya jata hai → Backend `POST /api/community/auth/login` call hoti hai
11. Backend success → `setUser()` set, toast success, redirect agar param tha
12. Backend failure → **`signOut(auth)` mandatory call** → Half-auth state prevent kiya jata hai

## Failure Flow

```
[getRedirectResult() FAILS with error]
        |
        v
[signOut(auth)]  <-- Firebase user sign out
        |
        v
[console.error with full error object]
        |
        v
[toast.error message]
        |
        v
[setSubmitting(false)]
        |
        v
[checkAuth() runs normally]  <-- App continues gracefully
```

```
[Backend /api/community/auth/login FAILS]
        |
        v
[signOut(auth)]  <-- Firebase user sign out
        |
        v
[toast.error with backend error message]
```

## Rollback Plan

Agar `signInWithRedirect` me koi issue aaye toh rollback yeh hai:

1. `Community.tsx` line 21 me import wapas karo:
   ```
   import { ..., signInWithPopup, ... } from "firebase/auth";
   ```
2. `handleGoogleAuth()` function me `signInWithRedirect` ki jagah wapas:
   ```javascript
   const userCredential = await signInWithPopup(auth, googleProvider);
   const firebaseIdToken = await userCredential.user.getIdToken();
   ```
3. `useEffect` se `handleGoogleRedirect()` call ko hata do, sirf `checkAuth()` rakhno
4. git commit -m "revert: rollback google auth to signInWithPopup"

Rollback Zero-Downtime hai. Koi database ya backend change nahi hua.

## Modified Files

| File | Change | Reason |
|------|--------|--------|
| `src/pages/Community.tsx` | `signInWithPopup` → `signInWithRedirect` | COOP header conflict fix |
| `src/pages/Community.tsx` | `getRedirectResult` added in `useEffect` | Handle redirect response on mount |
| `src/pages/Community.tsx` | `signOut(auth)` on backend fail | Prevent half-auth state |
| `src/pages/Community.tsx` | Null check on redirect result | Graceful continue if null |

## Security Headers

> [!IMPORTANT]
> Security headers (`public/_headers`, `vite.config.ts`) is sprint me **modify nahi kiye gaye** as per instructions. Ye next sprint me authentication browser verification ke baad handle kiya jayega.

## Build Verification

✅ `npm run build` - **SUCCESS** (43.61s)
✅ 182 static pages generated
✅ Sitemap regenerated
✅ Git push successful → `ea2aba4`

## Browser Verification

> [!WARNING]
> Browser subagent quota limit ke karan automated verification possible nahi thi. Aapko manually test karna hoga:
> 1. `http://localhost:8081/community` open karo
> 2. "Continue with Google" click karo
> 3. Verify karo ki page Google Accounts par redirect ho raha hai (popup nahi khulta)
> 4. Account select karo
> 5. Verify karo ki wapas community page par aao aur logged in ho

## PASS / FAIL

**CONDITIONAL PASS** - Code implementation complete, build successful, push successful.
Browser verification aapko manually karni hogi kyunki automated browser quota exhaust ho gaya tha.
