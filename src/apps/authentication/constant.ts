const EventMessage = {
  type: 'SW_LOGIN',
  action: {
    initAuth: 'INIT_AUTH',
    emailResponse: 'EMAIL_RESPONSE',
    loginSuccess: 'LOGIN_SUCCESS',
    pageRedirection: 'PAGE_REDIRECTION',
    locationHistoryUpdate: 'location-history-update'
  }
};

const AUTHENTICATION = 'Authentication';

const AuthRoutes = ['/ForgotPassword', '/ResetPassword', '/Authorize', '/'];
const SWLITE_REDIRECTION = 'swr';

export const APPS_TO_ADD_TO_MODULE_CONFIG = {
  ['telephony-app-widget']: 1,
  ['converse-app-widget']: 1,
  ['carter-app-widget']: 1
};

export const APP_IN_HEADER_CATEGORY = 1;

export { EventMessage, AuthRoutes, AUTHENTICATION, SWLITE_REDIRECTION };
