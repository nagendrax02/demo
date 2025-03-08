import {
  IEntityDetailsCoreData,
  IEntityRepresentationName,
  TabType
} from 'apps/entity-details/types/entity-data.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';
import { CallerSource } from 'src/common/utils/rest-client';
import { IEntityIds } from '../../entity-details/types/entity-store.types';

enum ActivityRenderType {
  LeadAudit = 1,
  OpportunityAudit,
  Custom,
  Task,
  Note,
  DeleteLogs,
  LeadCapture,
  Opportunity,
  Email,
  Web,
  Phone,
  Privacy,
  Portal,
  DynamicForm,
  Default
}

enum ActionIconType {
  Edit = 'Edit',
  Delete = 'Delete'
}

interface IActivityHistory {
  type: EntityType;
  customTypeFilter?: IOption[];
  tabType?: TabType;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

interface IAccountFields {
  SchemaName: string;
  Value: string;
  DisplayName: string;
  Fields: Record<string, string>[];
}
export interface IEntityBody {
  Query?: IQuery;
  Paging?: IPaging;
  Id?: string;
  PageIndex?: number;
  Source?: string;
  PageSize?: number | object;
  EventFilter?: IEventFilter[];
  From?: string | null;
  To?: string | null;
  ActivityId?: string | null;
  CanGetMetadata?: boolean;
  ActivityEvent?: string | null;
}

export interface IEventFilter {
  EventType: number;
  EventCodes: string[];
}

export interface IPaging {
  PageIndex: number;
  PageSize: number | object;
}

export interface IQuery {
  RelatedCompanyId: string;
  RelatedCompanyTypeId: string;
  RelatedCompanyTypeName: string;
  TabId: string;
  ActivityEventCodes: string[] | undefined;
  DateRange: IDateRange;
}

export interface IDateRange {
  DateField: string;
  FromDate: string | null;
  ToDate: string | null;
}

interface IActivityHistoryDetail {
  ActivityDateTime: string;
  ActivityEvent: number;
  ActivityName: string;
  ActivityType: number;
  AdditionalDetails: string;
  CanDeleteActivity: boolean;
  Id: string;
  IsEditable: number;
  LeadId: string;
  SystemDate: string;
  RestrictOperationsOnOpportunity?: boolean;
  Fields?: IAccountFields[];
  ActivityDisplayName?: string;
  CompanyActivityId?: string;
  CreatedByName?: string;
  CreatedBy?: string;
  Score?: string;
  RelatedCompanyId?: string;
  ActivityNote?: string;
  LogActivityEvent?: string;
  ActivityTypeProperties?: string;
  CanUpdate?: string;
}

export interface IAccountActivityHistory {
  RecordCount?: number;
  CompanyActivities?: IActivityHistoryDetail[];
}

export interface ICompanyActivities {
  CreatedBy: string;
  CompanyActivityId: string;
  ActivityEvent: number;
  ActivityDateTime: string;
  Fields: IField[];
  ActivityType: number;
  ActivityEventName: ActivityEventName;
}

export enum ActivityEventName {
  AccountOwnerChanged = 'AccountOwnerChanged',
  LeadAssociated = 'LeadAssociated'
}

export interface IField {
  SchemaName: SchemaName;
  Value: string;
  DisplayName: null;
  Fields: null;
}

export enum SchemaName {
  CompanyName = 'CompanyName',
  NewValue = 'NewValue',
  OldValue = 'OldValue',
  PerformerName = 'PerformerName'
}

interface IAuditData {
  OldValue: string;
  NewValue: string;
  ChangedBy: string;
  CompanyName?: string;
  PerformerName?: string;
}
type IAdditionalDetails = Record<string, string | undefined> | null;
interface IAugmentedAHDetail extends Partial<Omit<IActivityHistoryDetail, 'AdditionalDetails'>> {
  ActivityRenderType: ActivityRenderType;
  AdditionalDetails: IAdditionalDetails;
  AuditData?: IAuditData;
}

type IAugmentedActivityDetails = {
  [key in ActivityRenderType]: (
    data: IActivityHistoryDetail,
    type?: EntityType
  ) => IAugmentedAHDetail;
};

interface ITimeline {
  data: IAugmentedAHDetail;
  leadRepresentationName?: IEntityRepresentationName;
  entityIds?: IEntityIds;
  entityType?: EntityType;
  type?: EntityType;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

interface IMetaDataInfo {
  byLabel: string;
  callerSource: CallerSource;
  activityDateTime?: string;
  createdByName?: string;
  createdBy?: string;
  isTrackLocationEnabled?: boolean;
  longitude?: string;
  latitude?: string;
}

interface IBodyContent extends IMetaDataInfo {
  content: string | JSX.Element;
  callerSource: CallerSource;
  isTrackLocationEnabled?: boolean;
  longitude?: string;
  latitude?: string;
  children?: JSX.Element;
}

export { ActivityRenderType, ActionIconType };

interface IPageVisited {
  PageTitle: string;
  PageURL: string;
  PageName: string;
  PageHash: string;
  PageViews: number;
  VisitorCount: number;
  AverageTimeSpent: number;
  OrganicSearchCount: number;
  SocialMediaCount: number;
  ReferralsCount: number;
  DirectTrafficCount: number;
  EmailMarketingCount: number;
  OthersCount: number;
}

type IActivityComponents = {
  [key in ActivityRenderType]: React.FC<ITimeline>;
};

interface IAutomationTooltipDetails {
  Id: string;
  Action: string;
}

export type {
  IActivityHistory,
  IActivityHistoryDetail,
  IAuditData,
  IAugmentedAHDetail,
  IAccountFields,
  IAugmentedActivityDetails,
  ITimeline,
  IAdditionalDetails,
  IMetaDataInfo,
  IBodyContent,
  IPageVisited,
  IActivityComponents,
  IAutomationTooltipDetails
};
