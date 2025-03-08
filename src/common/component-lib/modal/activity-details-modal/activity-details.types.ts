import { ActivityBaseAttributeDataType } from 'common/types/entity/lead';
import { CallerSource } from 'common/utils/rest-client';

export interface IActivityDetailsModal {
  activityId: string;
  leadId?: string;
  entityId?: string;
  close: () => void;
  callerSource: CallerSource;
  renderNotes?: boolean;
  headerTitle?: string;
  isActivityHistory?: boolean;
  isAccountActivityHistoryTab?: boolean;
}

export interface IActivityFields {
  DataType: ActivityBaseAttributeDataType;
  DisplayName: string;
  Fields: IActivityFields[];
  IsMasked?: boolean;
  SchemaName: string;
  Value: string;
  DisplayValue: string;
  ShowInForm?: boolean;
  IsMandatory?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ActivityEvent_Note?: string;
  userEmail?: string;
  StringRenderType?: string;
  ActivityEvent?: number;
  ActivityNote?: string;
  CreatedByName?: string;
  CreatedOn?: string;
  ActivityDisplayName?: string;
}
