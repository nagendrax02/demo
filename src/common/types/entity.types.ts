import { IOpportunity, IOpportunityDetails, IOpportunityMetaData } from './entity';
import { ILead, ILeadDetails, ILeadMetadataMap } from './entity';
import { IAccount, IAccountDetails, IAccountMetaDataMap } from './entity';
import { IListDetails } from './entity/list';
import { IListMetadataMap } from './entity/list/detail.types';
import { IList } from './entity/list/list.types';

export enum EntityType {
  Lead = 'lead',
  Opportunity = 'opportunity',
  Account = 'account',
  Activity = 'activity',
  Task = 'task',
  AccountActivity = 'account-activity',
  Lists = 'lists',
  Ticket = 'ticket'
}

export type IEntity = ILead | IOpportunity | IAccount | IList;
export type IEntityDetails = ILeadDetails | IOpportunityDetails | IAccountDetails | IListDetails;
export type IEntityMetaData =
  | ILeadMetadataMap
  | IOpportunityMetaData
  | IAccountMetaDataMap
  | IListMetadataMap;
