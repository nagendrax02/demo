enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT'
}

enum Module {
  Marvin = 'MARVIN',
  Process = 'PROCESS',
  FileUpload = 'FILEUPLOAD',
  Connector = 'CONNECTOR',
  LeadManagement = 'LEADMANAGEMENT',
  Platform = 'PLATFORM_V1',
  V1 = 'V1',
  Cache = 'CACHE',
  PlatformBase = 'PLATFORM_APP_BASE_URL',
  SmartViews = 'SMARTVIEWS',
  Permission = 'PERMISSION',
  FieldSales = 'FIELD_SALES'
}

enum CallerSource {
  AccountDetails = 'AccountDetails',
  AccountAssignLeads = 'AccountAssignLeads',
  AccountDetailsVCard = 'AccountDetailsVCard',
  AccountDetailsProperties = 'AccountDetailsProperties',
  Authentication = 'Authentication',
  LeadDetails = 'LeadDetails',
  GlobalSearch = 'GlobalSearch',
  LeadDetailsManageTabs = 'LeadDetailsManageTab',
  LeadDetailsAddNewTab = 'LeadDetailsAddNewTab',
  LeadDetailsVCard = 'LeadDetailsVCard',
  LeadDetailsProperties = 'LeadDetailsProperties',
  EntityAttributeDetails = 'EntityAttributeDetails',
  ActivityHistory = 'LeadDetailsActivityHistory',
  AccountActivityHistory = 'AccountDetailsActivityHistory',
  AccountLeadFilters = 'AccountLeadFilters',
  ActivityHistoryTypeFilter = 'ActivityHistoryTypeFilter',
  ActivityHistoryCustomActivity = 'ActivityHistoryCustomActivity',
  ActivityHistoryLeadCapture = 'ActivityHistoryLeadCapture',
  ActivityHistoryOpportunityActivity = 'ActivityHistoryOpportunityActivity',
  ActivityHistoryPhoneActivity = 'ActivityHistoryPhoneActivity',
  ActivityHistoryPrivacyActivity = 'ActivityHistoryPrivacyActivity',
  ActivityHistoryPaymentActivity = 'ActivityHistoryPaymentActivity',
  ActivityHistoryEmailOpt = 'ActivityHistoryEmailOpt',
  ActivityHistoryEmailActivity = 'ActivityHistoryEmailActivity',
  ActivityHistoryChangeLog = 'ActivityHistoryChangeLog',
  ActivityHistoryDoNotTrackRequest = 'ActivityHistoryDoNotTrackRequest',
  ActivityHistorySalesActivity = 'ActivityHistorySalesActivity',
  ActivityHistoryPortalActivity = 'ActivityHistoryPortalActivity',
  ActivityHistoryOppAuditActivity = 'ActivityHistoryOppAuditActivity',
  ActivityHistoryLeadAuditActivity = 'ActivityHistoryLeadAuditActivity',
  ActivityHistoryDynamicFormSubmission = 'ActivityHistoryDynamicFormSubmission',
  ActivityHistoryConnectorEmail = 'ActivityHistoryConnectorEmail',
  ActivityHistoryDeleteLog = 'ActivityHistoryDeleteLog',
  Document = 'Document',
  Notes = 'Notes',
  Tasks = 'Tasks',
  NA = 'NA',
  ScheduledEmail = 'ScheduledEmail',
  LeadShareHistory = 'LeadShareHistory',
  EntityConnectorTab = 'EntityConnectorTab',
  MiPNavMenu = 'MiPNavMenu',
  MiPReportAIssue = 'MiPReportAIssue',
  MiPSwitchBack = 'MiPSwitchBack',
  ExternalApp = 'ExternalApp',
  CustomAction = 'CustomAction',
  OpportunityDetails = 'OpportunityDetails',
  SmartViews = 'SmartViews',
  MarvinHeader = 'MarvinHeader',
  BulkUpdate = 'BulkUpdate',
  AssignLeads = 'AssignLeads',
  SetPrimaryAccount = 'SetPrimaryAccount',
  OpportunityDetailsVCard = 'OpportunityDetailsVCard',
  OpportunityDetailsProperties = 'OpportunityDetailsProperties',
  OpportunityDetailsActivityHistory = 'OpportunityDetailsActivityHistory',
  AccountLeads = 'AccountLeads',
  AccountDelete = 'AccountDelete',
  OpportunityDelete = 'OpportunityDelete',
  ManageLeads = 'ManageLeads',
  ListDetails = 'ListDetails',
  Router = 'Router',
  CustomMenu = 'CustomMenu',
  ManageListDetails = 'ManageListDetails',
  ManageTasks = 'ManageTasks',
  ListDetailsRefreshList = 'ListDetailsRefreshList',
  EntityAuditTrail = 'EntityAuditTrail',
  Dashboard = 'Dashboard',
  PdfPreviewer = 'PdfPreviewer',
  ManageLists = 'ManageLists',
  ManageActivities = 'ManageActivities',
  TopNavigation = 'TopNavigation',
  QuickView = 'QuickView'
}
enum HttpResponseType {
  Json = 'JSON',
  Text = 'TEXT',
  HTML = 'HTML',
  Blob = 'BLOB'
}
export interface IRequestConfig extends Pick<RequestInit, 'headers'> {
  responseType?: HttpResponseType;
  abortTimeout?: number;
  doNotReIssueToken?: boolean;
  signal?: AbortSignal;
}

interface ITelemetryConfig {
  captureResponse?: boolean;
}
interface IRequest {
  url: RequestInfo | URL;
  method: HttpMethod;
  callerSource: CallerSource;
  body?: BodyInit;
  requestConfig?: IRequestConfig;
  telemetryConfig?: ITelemetryConfig;
  responseInterceptor?: (response: Response) => Promise<void> | void;
}

interface IExperienceLog extends IRequest {
  startTime: number;
  experience: { experienceId: string; experience: string };
}

interface IGet {
  path: string;
  module: Module;
  callerSource: CallerSource;
  requestConfig?: IRequestConfig;
  responseInterceptor?: (response: Response) => Promise<void> | void;
}

interface IPost<U> {
  path: string;
  module: Module;
  body: U;
  callerSource: CallerSource;
  requestConfig?: IRequestConfig;
  responseInterceptor?: (response: Response) => Promise<void> | void;
}

interface IHttpError extends Error {
  response?: IErroneousResponse;
  type?: string;
  status?: number;
}

interface IErroneousResponse {
  ExceptionMessage: string;
  ExceptionType: string;
  Message: string;
  Type: string;
  Data?: Record<string, string>;
  Code?: string;
}

interface IFetchedConfig {
  url: string;
  method: HttpMethod;
  body: BodyInit | null;
  headers: HeadersInit;
  signal: AbortSignal;
  credentials: string;
}

export { HttpResponseType, Module, HttpMethod, CallerSource };
export type {
  IHttpError,
  IRequest,
  IGet,
  IPost,
  IErroneousResponse,
  IFetchedConfig,
  IExperienceLog
};
