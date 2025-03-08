const API_URL = {
  LOGGER: 'https://api.marvin.crm4b2c.com/api/logger/r1/v1',
  MARVIN: 'https://service.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PROCESS: 'https://api.marvin.crm4b2c.com/api/process/r1/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files.crm4b2c.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://service.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  LEADMANAGEMENT: 'https://service.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PLATFORM_V1: 'https://service.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PLATFORM_APP_BASE_URL: 'https://run.crm4b2c.com',
  APP_DOMAIN: 'https://app.crm4b2c.com',
  MARVIN_APP_DOMAIN: 'https://app.marvin.crm4b2c.com',
  CACHE: 'https://api.marvin.crm4b2c.com/api/cache/r1/v1/[[ORGCODE]]',
  V1: 'https://service.crm4b2c.com/v1',
  SMARTVIEWS: 'https://api.marvin.crm4b2c.com/api/sv/r1/v1/[[ORGCODE]]',
  PERMISSION: 'https://api.marvin.crm4b2c.com/api/permission/r1/v1/[[ORGCODE]]',
  FIELD_SALES: 'https://fieldsales.crm4b2c.com/api/casa-service/v1'
};

const SWLITE_URL = {
  ['1']: 'https://app.crm4b2c.com'
};

const EXTERNAL_APP = {
  TELEPHONY_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://marvinui.marvintelephony.crm4b2c.com/TelephonyApp.test.js'
  },
  CONVERSE_APP_WIDGET: {
    Mode: 'Script',
    Url: 'https://converse-widget.crm4b2c.com/marvin-widget.js'
  }
};
const FORMS_RENDER_URL = 'https://forms.marvin.crm4b2c.com/?isSWLite=true';
const SMARTVIEWS_RENDER_URL = 'https://smartviews.marvin.crm4b2c.com';
const DASHBOARD_RENDER_URL = 'https://dashboard.marvin.crm4b2c.com';

const FORMS_API_URL = {
  LOGGER: 'https://api.marvin.crm4b2c.com/api/logger/r1/v1',
  MARVIN: 'https://service.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  PROCESS: 'https://api.marvin.crm4b2c.com/api/process/r[[REGION]]/v1/[[ORGCODE]]',
  FILEUPLOAD: 'https://files.crm4b2c.com/Marvin/[[ORGCODE]]',
  CONNECTOR: 'https://api.crm4b2c.com/v1/Marvin.svc/r1/[[ORGCODE]]',
  FORM: 'https://api.marvin.crm4b2c.com/api/fm/r1/v1/[[ORGCODE]]',
  V1: 'https://service.crm4b2c.com/v1',
  CACHE: 'https://api.marvin.crm4b2c.com/api/cache/r[[REGION]]/v1/[[ORGCODE]]',
  PERMISSION_MANAGEMENT: 'https://service.crm4b2c.com/v1/Marvin.svc/r[[REGION]]/[[ORGCODE]]',
  AUTH: 'https://api.marvin.crm4b2c.com/api/auth/r1/v1'
};

const ENV_CONFIG = {
  //The below version will be replaced by the build pipeline to obtain the deployment version. Do not change
  APP_VERSION: '1.0.110011',
  AUTH_API_BASE_URL: 'https://api.marvin.crm4b2c.com/api/auth/r1/v1',
  API_URL,
  EXTERNAL_APP,
  GOOGLE_MAP_API_KEY: 'AIzaSyCMNZI9YcHGej-IMp6CRK1Z4ByFUTtH53Q',
  WOOTRIC_ACC_ID: 'NPS-5d7a2275',
  API_URLS: {
    V1: 'https://service.crm4b2c.com/v1'
  },
  FORMS_API_URL,
  FORMS_RENDER_URL,
  SMARTVIEWS_RENDER_URL,
  SWLITE_URL,
  DASHBOARD_RENDER_URL,
  CASA_WEB: 'https://casa-web.fieldsales.crm4b2c.com',
  APP_TABS_MAX_LIMIT: 30
};

if (typeof self === 'object') {
  self.___env_var___ = ENV_CONFIG;
  self.envConfig = ENV_CONFIG;
}
