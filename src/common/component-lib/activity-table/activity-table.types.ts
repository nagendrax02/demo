import {
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { RenderType } from 'common/types/entity/lead';

export interface IChangeLogRow {
  DisplayName: string;
  OldValue: string | number | null;
  NewValue: string | number | null;
  DataType?: string | null;
}

export interface IField {
  Fields?: IField[] | null;
  DataType: string;
  DisplayName: string;
  DisplayValue?: string;
  SchemaName: string;
  Value: string;
  InternalName?: string;
  CustomObjectSchemaName?: string | null;
  ActivityId?: string | null;
  CFSSchemaName?: string;
  ShowInForm: boolean;
  IsMandatory: boolean;
  RenderType?: RenderType;
  StringRenderType?: string | null;
  IsVisible?: boolean | undefined;
  UserEmail?: string;
}

export interface IChangeLog {
  DisplayName: string;
  OldValue: null | string | number;
  NewValue: null | string | number;
  DataType: string;
  ShowInForm: boolean;
  IsMandatory: boolean;
  SchemaName: string;
  InternalName: string | null;
}

export interface IFieldRow {
  DisplayName: string;
  Value: string | number;
  IsFile?: boolean;
  SchemaName?: string;
  IsCFS?: boolean | null | string;
  IsHeading?: boolean;
  CustomObjectSchemaName?: string | null;
  ActivityId?: string | null;
  FilesCSV?: string;
  ActivityEventCode?: number;
  LeadId?: string;
  IsOpportunity?: boolean;
  OldValue?: string | number | null;
  NewValue?: string | number | null;
  DataType?: string | null;
}

export interface IAttachmentInfo {
  Name: string;
  AttachmentFile: string;
  AttachmentId: string;
  ShowPlayIcon?: boolean;
  RestrictDownload?: boolean;
  UsePreSignedURL?: boolean;
  Description?: string;
}

export interface IColumnConfig {
  field: string;
  key: string;
  width: number;
}

export type IAdditionalDetails = Record<string, string>;

export enum EventCode {
  SalesActivity = 30,
  ChangeLog = 3011,
  OpportunityChangeLog = 20005,
  DoNotTrackRequest = 28,
  LeadCapture = 23,
  OpportunityCapture = 33,
  DuplicateOppDetected = 32,
  InboundPhoneCallActivity = 21,
  OutboundPhoneCallActivity = 22,
  OptedInForEmail = 25,
  OptedOutForEmail = 26,
  FormSubmittedOnPortal = 90,
  RegisteredOnPortal = 91,
  PublisherTracking = 11001,
  DataProtectionRequest = 27,
  PrivacyCookieContent = 24,
  PaymentViaFormTab = 98,
  CancelledSalesActivity = 31,
  FormSavedAsDraftOnPortal = 21500
}

export enum TypeCode {
  CustomActivity = 2
}

export interface IDataFetcherProps {
  id: string;
  callerSource: CallerSource;
  eventCode?: number;
  typeCode?: number;
  additionalDetails?: IAdditionalDetails;
  restrictAudioDownload?: boolean;
  entityTabKey?: EntityTabKey;
  leadRepresentationName?: IEntityRepresentationName;
  isAccountActivityHistoryTab?: boolean;
}

export interface IDataFetcher {
  (data: IDataFetcherProps): Promise<IField[] | null>;
}

interface IGetRowConfig {
  (
    fields: IChangeLog[] | IField[],
    id: string,
    eventCode: number,
    leadId?: string,
    entityType?: EntityType
  ): IFieldRow[] | IChangeLogRow[];
}

export interface IConfig {
  dataFetcher: IDataFetcher;
  getRowConfig: IGetRowConfig;
  getColumnConfig: () => IColumnConfig[];
}

export interface IPreSignedUrl {
  id: string;
  url: string;
}

export interface IAttachmentFile {
  name: string;
  previewURL: string;
  key: string;
  type: string;
  restrictDownload: boolean;
  description?: string;
}

export enum EntityTabKey {
  AccountActivityHistory = 'accountActivityHistory',
  AccountLeadActivityHistory = 'leadActivityHistory'
}

export interface IActivityTable {
  id: string;
  typeCode: number;
  eventCode: number;
  callerSource: CallerSource;
  additionalDetails?: IAdditionalDetails;
  restrictAudioDownload?: boolean;
  leadId?: string;
  opportunityId?: string;
  entityTabKey?: EntityTabKey;
  entityType?: EntityType;
  enablePermissionCheck?: boolean;
  leadRepresentationName?: IEntityRepresentationName;
  entityDetailsCoreData?: IEntityDetailsCoreData | undefined;
  isAccountActivityHistoryTab?: boolean;
}
