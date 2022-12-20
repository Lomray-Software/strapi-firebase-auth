# Strapi plugin for firebase authentication

## Getting started

The package is distributed using [npm](https://www.npmjs.com/), the node package manager.

```
npm i --save @lomray/strapi-firebase-auth
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
