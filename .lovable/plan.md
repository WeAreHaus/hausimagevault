

## Plan: Add Simple Login Gate

Since there's no backend connected, this will be a client-side login gate with hardcoded credentials. It's sufficient for a demo/presentation but not production-secure.

### Changes

**`src/stores/authStore.ts`** (new)
- Simple auth store with `login(email, password)` and `logout()` methods
- Hardcoded credentials: `johan@haus.se` / `jochen`
- Persists login state in localStorage so user stays logged in across refreshes

**`src/pages/Login.tsx`** (new)
- Clean login form with email + password fields
- Shows error on invalid credentials
- Redirects to `/` on success

**`src/components/ProtectedRoute.tsx`** (new)
- Wrapper that checks auth state
- Redirects to `/login` if not authenticated

**`src/App.tsx`**
- Add `/login` route (public)
- Wrap the `AppLayout` route with `ProtectedRoute`
- Keep `/public/:slug` accessible without login

### Result
When published, visitors see a login screen. Only `johan@haus.se` with password `jochen` can access the app.

