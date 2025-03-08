const ERROR_MSG = {
  emptyPath: 'Path can not be empty',
  emptyBody: 'Invalid request data',
  generic: 'There was an error processing the request. Please contact administrator',
  permission: 'You do not have sufficient permissions. Please contact administrator.',
  actonPermission: "You don't have permission to perform this action",
  failedToUpdate: 'You do not have permission to update this field.'
};

const MX_EXCEPTION = 'MXException';

const HTTP_HEADERS = {
  authorization: 'Authorization',
  xLsqMarvinToken: 'x-LSQ-Marvin-Token',
  xLsqSessionId: 'x-LSQ-Session-Id',
  xLsqAppPermissions: 'x-lsq-app-permissions',
  xLsqEnableCompression: 'x-LSQ-Enable-Compression',
  xLsqAppCallerSrc: 'x-lsq-app-caller-src',
  contentType: 'Content-Type',
  cacheControl: 'Cache-Control',
  xLsqRegionId: 'x-LSQ-RegionId'
};

const ORGCODE_PLACEHOLDER = '[[ORGCODE]]';
const REGION_PLACEHOLDER = '[[REGION]]';
const MARVIN_ORG_PLACEHOLDER = '[[LSQ_MARVIN_ORGCODE]]';
const MARVIN_REGION_PLACEHOLDER = '[[LSQ_MARVIN_REGION]]';

const ABORT_TIMEOUT = 3 * 60 * 1000;

const FALLBACK_ORG_CODE = '10';

export {
  ERROR_MSG,
  MX_EXCEPTION,
  HTTP_HEADERS,
  ORGCODE_PLACEHOLDER,
  ABORT_TIMEOUT,
  REGION_PLACEHOLDER,
  MARVIN_ORG_PLACEHOLDER,
  MARVIN_REGION_PLACEHOLDER,
  FALLBACK_ORG_CODE
};
