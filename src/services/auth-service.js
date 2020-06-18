/* eslint-disable no-unused-vars */
import * as Msal from '@azure/msal-browser';

// Config object to be passed to Msal on creation
const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_OIDC_CLIENTID,
    authority: process.env.VUE_APP_OIDC_AUTHORITY,
    redirectUri: `${window.location.origin}/callback`,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: ['User.Read'],
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
  scopes: ['User.Read'],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

export default class AuthService {
  constructor() {
    console.log('[AuthService.constructor] started constructor');
    // Create the main app instance
    // configuration parameters are located at authConfig.js
    this.app = new Msal.PublicClientApplication(msalConfig);

    this.signInType = 'loginRedirect'; // 'loginPopup' or 'loginRedirect'
  }

  init = async () => {
    console.log('[AuthService.init] started init');

    console.log(this.app.getAccount());

    try {
      const tokenResponse = await this.app.handleRedirectPromise();
      console.log('[AuthService.init] tokenResponse', tokenResponse);
      const accountObj = tokenResponse ? tokenResponse.account : this.app.getAccount();
      if (accountObj) {
        console.log('[AuthService.init] id_token acquired', accountObj);
        await this.getTokenRedirect(loginRequest);
      } else if (tokenResponse && tokenResponse.tokenType === 'Bearer') {
        console.log('[AuthService.init] access_token acquired');
      } else if (tokenResponse === null) {
        // tokenResponse was null, attempt sign in or enter unauthenticated state for app
        console.log('[AuthService.init] signIn');
        await this.signIn();
      } else {
        console.log('[AuthService.init] tokenResponse was not null but did not have any tokens: ', tokenResponse);
      }
    } catch (error) {
      console.log('[AuthService.init] handleRedirectPromise error', error);
    }

    // SILENT SSO
    // Redirect: once login is successful and redirects with tokens, call Graph API
    // if (this.app.getAccount()) {
    //   // avoid duplicate code execution on page load in case of iframe and Popup window.
    //   console.log('[AuthService.constructor] SSO - Have account!', this.app.getAccount());
    // } else {
    //   console.log('[AuthService.constructor] SSO - calling ssoSilent');
    //   const silentRequest = {
    //     scopes: [msalConfig.clientId, 'User.Read'],
    //     loginHint: 'TODO',
    //   };
    //   this.app.ssoSilent(silentRequest).then(tokenResponse => {
    //     console.log('[AuthService.constructor] SSO - tokenResponse', tokenResponse);
    //     const accountObj = tokenResponse ? tokenResponse.account : this.app.getAccount();
    //     if (accountObj) {
    //       console.log('[AuthService.constructor] SSO - id_token acquired', accountObj);
    //       this.getTokenRedirect(loginRequest);
    //     } else if (tokenResponse && tokenResponse.tokenType === 'Bearer') {
    //       console.log('[AuthService.constructor] SSO - access_token acquired');
    //     } else {
    //       console.log(`[AuthService.constructor] SSO - token type is :${tokenResponse.tokenType}`);
    //     }
    //   }).catch(error => {
    //     console.error('[AuthService.constructor] SSO - Silent Error: ', error);
    //     if (error instanceof Msal.InteractionRequiredAuthError) {
    //       this.signIn();
    //     }
    //   });
    // }
  }

  signIn = async () => {
    console.log('[AuthService.signIn] signInType:', this.signInType);
    if (this.signInType === 'loginPopup') {
      try {
        const loginResponse = await this.app.loginPopup(loginRequest);
        this.login = loginResponse;
        console.log('[AuthService.signIn] loginResponse:', loginResponse);
      } catch (error) {
        console.log('[AuthService.signIn] loginPopup error', error);
      }
    } else if (this.signInType === 'loginRedirect') {
      this.app.loginRedirect(loginRequest);
    }
    return null;
  }

  signOut = () => {
    this.app.logout();
  }

  getAccessToken = () => {
    if (this.login) return this.login.accessToken;
    return null;
  }

  getIdToken = () => {
    if (this.app.getAccount()) return this.app.getAccount().idToken;
    return null;
  }

  getTokenPopup = async request => {
    try {
      const response = await this.app.acquireTokenSilent(request);
      return response;
    } catch (error) {
      console.log('silent token acquisition failed');
      if (error instanceof Msal.InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        console.log('acquiring token using popup');
        try {
          await this.app.acquireTokenPopup(request);
        } catch (err) {
          console.error(err);
        }
      }
      console.error(error);
    }
    return null;
  }

  // This function can be removed if you do not need to support IE
  getTokenRedirect = async () => {
    try {
      const response = await this.app.acquireTokenSilent(loginRequest);
      return response;
    } catch (error) {
      console.log('silent token acquisition failed');
      if (error instanceof Msal.InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        console.log('acquiring token using redirect');
        await this.app.acquireTokenRedirect(loginRequest);
      }
    }
    return null;
  }

  getProfile = async () => {
    if (!this.app.getAccount()) return null;

    let response;
    if (this.signInType === 'loginPopup') {
      response = await this.getTokenPopup(loginRequest);
    } else {
      response = await this.getTokenRedirect(loginRequest);
    }

    // Add here the endpoints for MS Graph API services you would like to use.
    const graphConfig = { graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me' };

    const user = await this.callMSGraph(graphConfig.graphMeEndpoint, response.accessToken);
    return user;
  }

  // Helper function to call MS Graph API endpoint
  // using authorization bearer token scheme
  callMSGraph = async (endpoint, accessToken) => {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append('Authorization', bearer);

    const options = {
      method: 'GET',
      headers,
    };

    console.log(`request made to Graph API at: ${new Date().toString()}`);

    const response = await fetch(endpoint, options);
    const data = await response.json();
    return data;
  }
}
