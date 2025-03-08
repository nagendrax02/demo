import { IAuditData } from 'apps/activity-history/types';

export interface ISourceChangeField {
  DisplayName: string;
  DataType: string;
  Value?: string;
  OldValue?: string;
  NewValue?: string;
}

export interface ISourceChange {
  auditData: IAuditData | undefined;
  fieldDisplayName: string | undefined;
  oldAdditionalValue: string | undefined;
  newAdditionalValue: string | undefined;
  changedById: string | undefined;
}

export interface ISourceChangeData {
  title: string;
  data: ISourceChangeField[] | null | undefined;
  isOldAndNewValueSame: boolean | undefined;
}

export interface IModal {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  sourceChangeData: ISourceChangeData | null;
}
