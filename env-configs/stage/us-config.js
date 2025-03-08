const API_URL = {
  LOGGER: 'https://app.marvin.lsq-staging.com/api/logger/r11/v1',
  MARVIN: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PROCESS: 'https://app.marvin.lsq-staging.com/api/process/r11/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files-us11.lsq-staging.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  LEADMANAGEMENT: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PLATFORM_V1: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  FORM: 'https://app.marvin.crm4b2c.com/api/fm/r1/v1/[[ORGCODE]]',
  APP_DOMAIN: 'https://app-us.lsq-staging.com',
  MARVIN_APP_DOMAIN: 'https://app-us11.marvin.lsq-staging.com',
  CACHE: 'https://app.marvin.lsq-staging.com/api/cache/r11/v1/[[ORGCODE]]',
  V1: 'https://service-us11.lsq-staging.com/v1',
  SMARTVIEWS: 'https://app-us11.marvin.lsq-staging.com/api/sv/r11/v1/[[ORGCODE]]',
  PLATFORM_APP_BASE_URL: 'https://us11.lsq-staging.com',
  PERMISSION: 'https://app.marvin.lsq-staging.com/api/permission/r11/v1/[[ORGCODE]]',
  FIELD_SALES: 'https://fieldsales.lsq-staging.com/api/casa-service/v1'
};

const SWLITE_URL = {
  ['1']: 'https://app.lsq-staging.com',
  ['11']: 'https://app-us.lsq-staging.com',
  ['21']: 'https://app-in21.mxradon.lsq-staging.com'
};

const EXTERNAL_APP = {
  TELEPHONY_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://marvinui.marvintelephony.lsq-staging.com/TelephonyApp.stage.js'
  },
  CONVERSE_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://converse-widget-seo.lsq-staging.com/marvin-widget.js'
  }
};

const FORMS_API_URL = {
  LOGGER: 'https://app.marvin.lsq-staging.com/api/logger/r11/v1',
  MARVIN: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  PROCESS: 'https://app.marvin.lsq-staging.com/api/process/r11/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files-us11.lsq-staging.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  FORM: 'https://app.marvin.lsq-staging.com/api/fm/r11/v1/[[ORGCODE]]',
  V1: 'https://service-us11.lsq-staging.com/v1',
  CACHE: 'https://app.marvin.lsq-staging.com/api/cache/r11/v1/[[ORGCODE]]',
  PERMISSION_MANAGEMENT: 'https://service-us11.lsq-staging.com/v1/Marvin.svc/r11/[[ORGCODE]]',
  AUTH: 'https://app-us11.marvin.lsq-staging.com/api/auth/r11/v1'
};

const FORMS_RENDER_URL = 'https://forms-us11.marvin.lsq-staging.com/?isSWLite=true';
const SMARTVIEWS_RENDER_URL = 'https://smartviews-us11.marvin.lsq-staging.com';
const DASHBOARD_RENDER_URL = 'https://dashboard-us11.marvin.lsq-staging.com';

const ENV_CONFIG = {
  //The below version will be replaced by the build pipeline to obtain the deployment version. Do not change
  APP_VERSION: '1.0.110011',
  AUTH_API_BASE_URL: 'https://app-us11.marvin.lsq-staging.com/api/auth/r11/v1',
  API_URL,
  FORMS_API_URL,
  EXTERNAL_APP,
  GOOGLE_MAP_API_KEY: 'AIzaSyCMNZI9YcHGej-IMp6CRK1Z4ByFUTtH53Q',
  WOOTRIC_ACC_ID: 'NPS-5d7a2275',
  API_URLS: {
    V1: 'https://api-us11.lsq-staging.com/v1'
  },
  FORMS_API_URL,
  FORMS_RENDER_URL,
  SMARTVIEWS_RENDER_URL,
  DASHBOARD_RENDER_URL,
  SWLITE_URL,
  REGION_ID: '11',
  CASA_WEB: 'https://casa-web.fieldsales.lsq-staging.com'
};

if (typeof self === 'object') {
  self.___env_var___ = ENV_CONFIG;
  self.envConfig = ENV_CONFIG;
}
