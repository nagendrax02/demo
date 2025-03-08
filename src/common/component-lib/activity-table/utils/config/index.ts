import { EventCode, TypeCode, IConfig, IDataFetcher } from '../../activity-table.types';
import {
  getActivityDetailsResponse,
  getPrivacyDetailsResponse,
  getChangeLogResponse,
  getEmailOptedInAndOptedOutResponse,
  getPhoneActivityResponse,
  getDoNotTrackRequestResponse,
  getLeadCaptureResponse,
  getOpportunityCaptureResponse,
  getPaymentDetailsResponse
} from './data-fetcher';
import {
  getDefaultRowConfig,
  getFormSavedAsDraftOnPortalRowConfig,
  getNewAndOldValueRowConfig
} from './row-config';
import {
  getDefaultColumnConfig,
  getNewAndOldValueColumnConfig,
  getMediumColumnConfig,
  getOppCaptureColumnConfig
} from './column-config';
import { CallerSource } from 'common/utils/rest-client';

const defaultRowAndColumnConfig = {
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getDefaultColumnConfig
};

const defaultConfig: IConfig = {
  dataFetcher: getActivityDetailsResponse as IDataFetcher,
  ...defaultRowAndColumnConfig
};

const formSavedAsDraftOnPortalConfig: IConfig = {
  dataFetcher: getActivityDetailsResponse as IDataFetcher,
  getRowConfig: getFormSavedAsDraftOnPortalRowConfig,
  getColumnConfig: getDefaultColumnConfig
};

const paymentConfig: IConfig = {
  dataFetcher: getPaymentDetailsResponse as IDataFetcher,
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getMediumColumnConfig
};

const salesActivityConfig: IConfig = {
  dataFetcher: getActivityDetailsResponse as IDataFetcher,
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getMediumColumnConfig
};

const privacyConfig: IConfig = {
  dataFetcher: getPrivacyDetailsResponse as IDataFetcher,
  ...defaultRowAndColumnConfig
};

const logConfig: IConfig = {
  dataFetcher: getChangeLogResponse as unknown as IDataFetcher,
  getRowConfig: getNewAndOldValueRowConfig,
  getColumnConfig: getNewAndOldValueColumnConfig
};

const phoneConfig: IConfig = {
  dataFetcher: getPhoneActivityResponse as IDataFetcher,
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getMediumColumnConfig
};

const emailConfig: IConfig = {
  dataFetcher: getEmailOptedInAndOptedOutResponse as IDataFetcher,
  ...defaultRowAndColumnConfig
};

const oppConfig: IConfig = {
  dataFetcher: getOpportunityCaptureResponse as IDataFetcher,
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getOppCaptureColumnConfig
};

const doNotTrackRequireConfig: IConfig = {
  dataFetcher: getDoNotTrackRequestResponse as unknown as IDataFetcher,
  ...defaultRowAndColumnConfig
};

const leadCaptureConfig: IConfig = {
  dataFetcher: getLeadCaptureResponse as IDataFetcher,
  getRowConfig: getDefaultRowConfig,
  getColumnConfig: getDefaultColumnConfig
};

const eventCodeConfigMap: { [key in EventCode]: IConfig } = {
  [EventCode.SalesActivity]: salesActivityConfig as IConfig,
  [EventCode.RegisteredOnPortal]: defaultConfig,
  [EventCode.FormSubmittedOnPortal]: defaultConfig,
  [EventCode.PublisherTracking]: defaultConfig,
  [EventCode.PaymentViaFormTab]: paymentConfig,
  [EventCode.CancelledSalesActivity]: defaultConfig,
  [EventCode.DataProtectionRequest]: privacyConfig,
  [EventCode.PrivacyCookieContent]: privacyConfig,
  [EventCode.ChangeLog]: logConfig,
  [EventCode.OpportunityChangeLog]: logConfig,
  [EventCode.InboundPhoneCallActivity]: phoneConfig,
  [EventCode.OutboundPhoneCallActivity]: phoneConfig,
  [EventCode.OptedInForEmail]: emailConfig,
  [EventCode.OptedOutForEmail]: emailConfig,
  [EventCode.OpportunityCapture]: oppConfig,
  [EventCode.DuplicateOppDetected]: oppConfig,
  [EventCode.DoNotTrackRequest]: doNotTrackRequireConfig,
  [EventCode.LeadCapture]: leadCaptureConfig,
  [EventCode.FormSavedAsDraftOnPortal]: formSavedAsDraftOnPortalConfig
};

const typeCodeConfigMap = {
  [TypeCode.CustomActivity]: {
    dataFetcher: getActivityDetailsResponse,
    getRowConfig: getDefaultRowConfig,
    getColumnConfig: getDefaultColumnConfig
  }
};

export const getConfig = (eventCode: EventCode, typeCode: TypeCode): IConfig | undefined => {
  return eventCodeConfigMap[eventCode] || typeCodeConfigMap[typeCode];
};
