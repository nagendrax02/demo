const API_URL = {
  LOGGER: 'https://app.marvin.lsq-staging.com/api/logger/r1/v1',
  MARVIN: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PROCESS: 'https://app.marvin.lsq-staging.com/api/process/r1/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files.lsq-staging.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  LEADMANAGEMENT: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PLATFORM_V1: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  APP_DOMAIN: 'https://app.lsq-staging.com',
  MARVIN_APP_DOMAIN: 'https://app.marvin.lsq-staging.com',
  V1: 'https://service.lsq-staging.com/v1',
  CACHE: 'https://app.marvin.lsq-staging.com/api/cache/r1/v1/[[ORGCODE]]',
  SMARTVIEWS: 'https://app.marvin.lsq-staging.com/api/sv/r1/v1/[[ORGCODE]]',
  PLATFORM_APP_BASE_URL: 'https://run.lsq-staging.com',
  PERMISSION: 'https://app.marvin.lsq-staging.com/api/permission/r1/v1/[[ORGCODE]]',
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
  LOGGER: 'https://app.marvin.lsq-staging.com/api/logger/r1/v1',
  MARVIN: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PROCESS: 'https://api.marvin.lsq-staging.com/api/process/r1/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files.lsq-staging.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  FORM: 'https://app.marvin.lsq-staging.com/api/fm/r1/v1/[[ORGCODE]]',
  V1: 'https://service.lsq-staging.com/v1',
  CACHE: 'https://app.marvin.lsq-staging.com/api/cache/r1/v1/[[ORGCODE]]',
  PERMISSION_MANAGEMENT: 'https://service.lsq-staging.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  AUTH: 'https://app.marvin.lsq-staging.com/api/auth/r1/v1'
};

const FORMS_RENDER_URL = 'https://forms.marvin.lsq-staging.com/?isSWLite=true';
const SMARTVIEWS_RENDER_URL = 'https://smartviews.marvin.lsq-staging.com';
const DASHBOARD_RENDER_URL = 'https://dashboard.marvin.lsq-staging.com';

const ENV_CONFIG = {
  //The below version will be replaced by the build pipeline to obtain the deployment version. Do not change
  APP_VERSION: '1.0.110011',
  AUTH_API_BASE_URL: 'https://app.marvin.lsq-staging.com/api/auth/r1/v1',
  API_URL,
  EXTERNAL_APP,
  GOOGLE_MAP_API_KEY: 'AIzaSyCMNZI9YcHGej-IMp6CRK1Z4ByFUTtH53Q',
  WOOTRIC_ACC_ID: 'NPS-5d7a2275',
  API_URLS: {
    V1: 'https://api.lsq-staging.com/v1'
  },
  FORMS_API_URL,
  FORMS_RENDER_URL,
  SMARTVIEWS_RENDER_URL,
  DASHBOARD_RENDER_URL,
  SWLITE_URL,
  REGION_ID: '1',
  CASA_WEB: 'https://casa-web.fieldsales.lsq-staging.com'
};

if (typeof self === 'object') {
  self.___env_var___ = ENV_CONFIG;
  self.envConfig = ENV_CONFIG;
}
