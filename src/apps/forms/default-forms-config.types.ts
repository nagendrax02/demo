import { EnableAssociationEnum } from './common.types';

export enum DefaultFormEntity {
  LEAD = 0,
  OPPORTUNITY = 1,
  ACTIVITY = 2,
  TASK = 3,
  AGENT = 4,
  ACCOUNT = 5,
  ACCOUNTACTIVITY = 6
}

export enum ProcessType {
  ADDNEW = 0,
  VCARD = 1,
  QUICKADD = 2,
  VCARDPROPERTIES = 3,
  OPPORTUNITYRELATEDLEAD = 4
}

interface IFormRelatedEntityType {
  AccountCode: string;
}

export interface IFormWithDefaultConfig {
  Name?: string;
  Entity?: DefaultFormEntity | number;
  Type?: ProcessType;
  IsBulkAction?: boolean;
  EntityType?: string;
  DefaultFormAdditionalData?: Record<string, string>;
  RelatedEntityType?: IFormRelatedEntityType;
  EnableAssociationSelection?: EnableAssociationEnum;
}
