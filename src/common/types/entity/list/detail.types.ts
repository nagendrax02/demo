import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { ICustomActions } from '../lead/custom-actions.types';
import { ILeadAttribute } from '../lead';

interface IListDetails {
  CreatedBy: string;
  CreatedByEmail: string;
  CreatedByName: string;
  CreatedOn: string;
  Definition: string | null;
  Description: string;
  ID: string;
  InternalName: string | null;
  ListType: number;
  MemberCount: number;
  ModifiedBy: string;
  ModifiedByEmail: string;
  ModifiedByName: string;
  ModifiedOn: string;
  Name: string;
  customActions?: ICustomActions;
  Fields: Record<string, string | null>;
}

interface IScheduledEmailCount {
  [key: string]: number;
}

interface IListMetaData {
  LeadRepresentationConfig?: IEntityRepresentationName;
  Fields?: ILeadAttribute[];
}

interface IListMetadataMap {
  [key: string]: ILeadAttribute;
}

export type { IListDetails, IScheduledEmailCount, IListMetaData, IListMetadataMap };
