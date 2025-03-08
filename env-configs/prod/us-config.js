const API_URL = {
  LOGGER: 'https://marvin-us11.leadsquared.com/api/logger/r11/v1',
  MARVIN: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PROCESS: 'https://marvin-api-us11.leadsquared.com/api/process/r11/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files-us11.leadsquared.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  LEADMANAGEMENT: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PLATFORM_V1: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  APP_DOMAIN: 'https://app-us11.leadsquared.com',
  MARVIN_APP_DOMAIN: 'https://marvin-us11.leadsquared.com',
  V1: 'https://marvin-service-us11.leadsquared.com/v1',
  CACHE: 'https://marvin-api-us11.leadsquared.com/api/cache/r11/v1/[[ORGCODE]]',
  SMARTVIEWS: 'https://marvin-api-us11.leadsquared.com/api/sv/r11/v1/[[ORGCODE]]',
  PLATFORM_APP_BASE_URL: 'https://us11.leadsquared.com',
  PERMISSION: 'https://marvin-api-us11.leadsquared.com/api/permission/r11/v1/[[ORGCODE]]',
  FIELD_SALES: 'https://fieldsales-in21.leadsquared.com/api/casa-service/v1'
};

const SWLITE_URL = {
  ['1']: 'https://app.leadsquared.com',
  ['11']: 'https://app-us11.leadsquared.com',
  ['12']: 'https://app-ca12.leadsquared.com',
  ['21']: 'https://app-in21.leadsquared.com',
  ['31']: 'https://app-ir31.leadsquared.com'
};

const FORMS_API_URL = {
  LOGGER: 'https://marvin-us11.leadsquared.com/api/logger/r11/v1',
  MARVIN: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PROCESS: 'https://marvin-api-us11.leadsquared.com/api/process/r11/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files-us11.leadsquared.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  FORM: 'https://marvin-api-us11.leadsquared.com/api/fm/r1/v1/[[ORGCODE]]',
  V1: 'https://marvin-api-us11.com.leadsquared.com/v1',
  CACHE: 'https://marvin-api-us11.com.leadsquared.com/api/cache/r1/v1/[[ORGCODE]]',
  PERMISSION_MANAGEMENT:
    'https://marvin-service-us11.leadsquared.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  AUTH: 'https://marvin-us11.leadsquared.com/api/auth/r11/v1'
};

const EXTERNAL_APP = {
  TELEPHONY_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://marvintelephony-ui.leadsquared.com/TelephonyApp.js'
  },
  CONVERSE_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://converse-widget-us11.leadsquared.com/marvin-widget.js'
  }
};

const FORMS_RENDER_URL = 'https://forms-marvin-us11.leadsquared.com/?isSWLite=true';
const SMARTVIEWS_RENDER_URL = 'https://smartviews-marvin-us11.leadsquared.com';
const DASHBOARD_RENDER_URL = 'https://dashboard-marvin-us11.leadsquared.com';

const ENV_CONFIG = {
  //The below version will be replaced by the build pipeline to obtain the deployment version. Do not change
  APP_VERSION: '1.0.110011',
  AUTH_API_BASE_URL: 'https://marvin-us11.leadsquared.com/api/auth/r11/v1',
  API_URL,
  EXTERNAL_APP,
  GOOGLE_MAP_API_KEY: 'AIzaSyCi_E1g8nxQ-sKOLFzHzVW0gE57SFVgXfc',
  WOOTRIC_ACC_ID: 'NPS-33bffbc8',
  API_URLS: {
    V1: 'https://marvin-service-us11.leadsquared.com/v1'
  },
  FORMS_API_URL,
  FORMS_RENDER_URL,
  SMARTVIEWS_RENDER_URL,
  DASHBOARD_RENDER_URL,
  SWLITE_URL,
  REGION_ID: '11',
  CASA_WEB: 'https://casa-web-in21.leadsquared.com'
};

if (typeof self === 'object') {
  self.___env_var___ = ENV_CONFIG;
  self.envConfig = ENV_CONFIG;
}
