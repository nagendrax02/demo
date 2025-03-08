/**
 * @enum - Centralized storage for storage manager keys.
 * All storage manager related keys are stored and managed here for ease of reference and maintenance.
 */
export enum StorageKey {
  LeadDetails = 'lead-details',
  Auth = 'auth',
  UserAuthDetails = 'user-auth-details',
  UserName = 'user-name',
  Language = 'language',
  LDLeadTypeCompoundData = 'ld-leadtype-compound-data',
  LeadTypeConfig = 'lead-type-config',
  LDCompoundData = 'ld-compound-data',
  ODCompoundData = 'od-compound-data',
  ADCompoundData = 'ad-compound-data',
  ADType = 'ad-type',
  ADMetaData = 'ad-meta-data',
  AccountRepresentationName = 'account-representation-name',
  LDMetaData = 'ld-meta-data',
  ODMetaData = 'od-meta-data',
  Setting = 'setting',
  Permissions = 'permissions',
  EnableSandbox = 'enable-sandbox',
  ActivityCategoryMetadata = 'activity-category-metadata',
  AHEventsCodes = 'ah-event-codes',
  AHLeadEventsCodes = 'ah-lead-event-codes',
  AccountAHEventsCodes = 'account-ah-event-codes',
  AHDateFilter = 'ah-date-filter',
  Process = 'process',
  LeadStarred = 'lead-starred',
  OpportunityRepName = 'opportunity-representation-name',
  NotesDateFilter = 'notes-date-filter',
  LeadDocumentsFilter = 'lead-documents-filter',
  TasksDateFilter = 'tasks-date-filter',
  TasksStatusFilter = 'tasks-status-filter',
  LeadRepresentationName = 'lead-representation-name',
  ActivityHistoryDefault = 'ah-default',
  ActivityMetaData = 'activity-metadata',
  EmailConfig = 'email-config',
  EmailSettings = 'email-settings',
  AhDefaultPageSize = 'ah-default-page-size',
  OpportunityEnabled = 'opportunity-enabled',
  Logger = 'logger',
  AssociatedPhones = 'associated-phones',
  InduceFatal = 'induce-fatal',
  AccountTypeName = 'account-type-name',
  AccountTypeId = 'account-type-id',
  CustomActions = 'custom-actions',
  ListsCustomActions = 'lists-custom-actions',
  BulkUpdate = 'bulk-update',
  TaskMetaData = 'task-metadata',
  ProductNames = 'product-names',
  OpportunityVcardTitle = 'opportunity-vcard-title',
  CustomSmartViewTabs = 'CustomSmartViewTabs',
  AccountActivityMetaData = 'account-activity-metadata',
  Users = 'users',
  UserRestrictions = 'feature-restriction-user-restrictions',
  UserActions = 'feature-restriction-user-actions',
  HeaderInfo = 'web-header-info',
  SelectedTheme = 'selected-theme',
  PostLoginConfig = 'post-login-config',
  SearchHistory = 'search-history',
  CustomMenu = 'custom-menu',
  MailMergedUrls = 'mail-merged-urls',
  SmartviewMetaData = 'smartview-meta-data',
  AccountData = 'account-data',
  EntityExportColumns = 'entity-export-columns',
  QuickFilter = 'lead-quick-filter',
  AuditTrailTypeFilter = 'audit-trail-type-filter',
  AuditTrailDateFilter = 'audit-trail-date-filter',
  CasaData = 'casa-web-filters',
  TaskTypeFilterOptions = 'task-type-filter-options',
  AccountTypeFilterOptions = 'account-type-filter-options',
  UserPersonalisationKey = 'user-personalisation',
  IsODVCEnabled = 'IsODVCEnabled',
  IdleUserSessionExpireTime = 'idleTimer',
  Drafts = 'form-drafts',
  AppTabsConfig = 'app-tabs-config',
  DragDropModal = 'drag-drop-modal-position',
  FullScreenVisitedLinks = 'visited-links',
  GlobalSearchKeywordsHistory = 'global-search-keywords-history',
  GlobalSearchResultsHistory = 'global-search-results-history',
  HideSendEmailConfirmationModal = 'send-email-confirm-modal',
  TestEmails = 'test-emails',
  ManageActivityPinnedActivities = 'manage-activity-pinned-event-codes',
  ManageActivityPanelState = 'manage-activity-panel-state',
  ManageActivityLastSelectedActivity = 'manage-activity-last-selected-activity',
  SmartViewsPanelOrientation = 'smart-views-panel-orientation',
  EnableFormsCloneUrl = 'enable-forms-clone-url',
  SmartViewsActiveTabId = 'smart-views-active-tab-id',
  EnableAppHeader = 'enable-app-header',
  IsAppHeaderInitialized = 'is-app-header-initialized'
}

export enum UserPersonalisationKeys {
  AHTypeFilter = 'ah-event-codes',
  AHDateFilterCheck = 'ah-date-filter'
}

export enum InMemoryStorageKey {
  Product = 'Product',
  SetLocation = 'swlite-set-location'
}

export enum CookieStorageKey {
  SessionUrl = 'session-url'
}

export enum ExternalAppStorageKey {
  UserAuthDetails = 'USERAUTH-AUTH-DETAILS',
  AuthToken = '-AUTH-TOKEN'
}
