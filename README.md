# Vue SPA with OAuth 2.0 OIDC PKCE auth sample with MSAL v2

NOTE: THIS APP IS A WORK IN PROGRESS...

The aim of this app is to demonstrate immediatly initiating a user login against Azure AD Auth 2.0 OIDC w/Auth Code Flow PKCE.


Currently, this app is using the [@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) JavaScript library.

This library is in preview/beta.  

- It is important that you use v2.x of msal-browser to do PKCE.  
- Instructions to use it are here: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser/docs

## GETTING STARTED

- In the Azure AD portal, create an SPA app and register the callback `http://localhost:8080/callback`
- Clone, fork or download this app
- From the termainal, run `npm install`
- Update the `.env.development` file with the `VUE_APP_OIDC_AUTHORITY` and `VUE_APP_OIDC_CLIENTID` from your Azure AD spa app.  (The `VUE_APP_API_URL` is for a api for demonstration purposes.)
- If you have an api you wish to secure, set the `VUE_APP_API_URL` property
- From the terminal, run `npm run serve`
- Point your browser to `http://localhost:8080`

## CONFIGURATION

- To change the login type, change this line in the `auth-service.js`

```javascript
this.signInType = 'loginRedirect'; // 'loginPopup' or 'loginRedirect'
```
