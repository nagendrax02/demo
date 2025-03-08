import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { EntityType, ILead, IOpportunity } from 'common/types';
import { IActionConfig } from 'apps/entity-details/types';
import { ITicket } from './ticket/ticket.types';

export type IAdditionalData = Record<string, unknown> | ITicket;

export type IQuickViewActionConfig = {
  actionHelper: IAdditionalData;
  actions: IActionConfig[];
};
export interface IGetAugmentedData {
  entityId: string;
  entityType: EntityType;
  entityTypeCode?: string; //TaskTypeId, Opp event code
  entityRecord?: IAdditionalData;
  workAreaConfig?: IWorkAreaConfig;
  actionsConfig?: IQuickViewActionConfig;
  showPlaceHolder?: boolean;
  setRefreshQuickView?: (value: string) => void;
}

export interface IQuickView {
  entityId: string;
  entityTypeCode?: string; //TaskTypeId, Opp event code
  entityType: EntityType;
  entityRecord?: IAdditionalData;
  actionsConfig?: IQuickViewActionConfig;
  showPlaceHolder?: boolean;
}

export interface IGlobalSearchActionEntity {
  entityType: EntityType;
  entityRawData: ILead | IOpportunity | null;
  entityCode?: string;
}
