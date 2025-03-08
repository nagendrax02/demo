import { IAuditData } from 'apps/activity-history/types';

export interface IStatusChangeField {
  DataType: string;
  DisplayName: string;
  ShowInForm: boolean;
  Value: string;
}

export interface IStatusChange {
  auditData: IAuditData | undefined;
  activityName: string | undefined;
  fieldDisplayName: string | undefined;
  oldAdditionalValue: string | undefined;
  newAdditionalValue: string | undefined;
  changedById: string | undefined;
}
