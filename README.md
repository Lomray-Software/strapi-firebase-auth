# Strapi plugin for firebase authentication

## Scope and compatibility

Release `@lomray/strapi-firebase-auth@1.0.6` exchanges a Firebase ID token for a
Strapi Users & Permissions JWT. It is not authentication for Strapi administrators.
The plugin uses Strapi 4 APIs. Its broad `@strapi/strapi >=4` peer range is not proof
of Strapi 5 compatibility; verify a newer major separately before adopting it.
The published Node engine range is `>=14.19.1 <=18.x.x` (legacy, end-of-life runtimes).
Do not treat that historical range as a recommendation for a new production deployment.

## Getting started

The package is distributed using [npm](https://www.npmjs.com/), the node package manager.

```
npm i --save @lomray/strapi-firebase-auth@1.0.6
```

## How it works:
1. Get firebase token in your app (e.g.: `auth().currentUser.getIdToken()`)
2. Call API POST `/api/firebase/login` with `{"token": "your-firebase-token"}`
3. Use returned jwt token to call Strapi API (if the user does not exist it will be created automatically).

If Strapi JWT token expired, just call `/api/firebase/login` again.

**NOTE**: Configure plugin before use, see `Firebase Credentials` in Settings section (Admin Panel).  
**NOTE2**: Add `phone` and `photoUrl` fields to user entity for save related firebase fields (not required).

## Report Bugs/Issues
Any bugs/issues you may face can be submitted as issues in the GitHub repo.

## Authentication boundary

Configure the Firebase service account on the server through this plugin's admin settings.
Never put service-account JSON in browser code, a public repository, or an example request.
The client sends a Firebase **ID token**, not the service-account credential.

The login service verifies the ID token, loads its Firebase user, and identifies the Strapi
user by provider `firebase` plus the Firebase UID in `username`. This is not automatic
email-based linking to an existing password account. A new user receives the configured
Users & Permissions default role. Review that role's permissions before exposing login.
Blocked Strapi users and disabled Firebase users are rejected.

This login path creates users without checking the usual registration or email-confirmation
settings and marks new users confirmed. Do not rely on disabling ordinary registration to
disable Firebase account creation. ID-token verification does not request a revocation check.

The response contains `jwt` and a sanitized `user`. Keep tokens out of logs and use HTTPS.
The default content API route is `POST /api/firebase/login`; a customized Strapi API prefix
changes the public URL. See [route registration](server/routes/index.ts) and
[login implementation](server/services/firebase-auth.ts).

The optional `name`, `phone`, and `photoUrl` attributes are copied only when those fields
exist on the user content type. No Firebase project or end-to-end Strapi deployment is
included in this repository's documentation example.

## Documentation checks

Run `node scripts/check-docs.cjs` from this repository. This checks documentation against local manifests and source, not a deployed integration.
