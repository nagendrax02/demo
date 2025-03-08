export declare enum EnableAssociationEnum {
  LEAD = 0,
  OPPORTUNITY = 1
}

export declare enum AssociatedEntity {
  LEAD = 0,
  OPPORTUNITY = 1
}

export declare enum FormEntityType {
  LEAD = 1,
  ACTIVITY = 2,
  TASK = 5,
  OPPORTUNITY = 6,
  ACCOUNT = 4,
  ACCOUNTACTIVITY = 7,
  SPECIAL = 3,
  CUSTOMENTITY = 8
}

export interface IIFrameData {
  callbackTriggerId: string;
  arguments: unknown;
}

export type IFunctionType = (...args) => void;

export const MarvinQuickAddWorkAreaIds = [204, 202, 205, 203];
