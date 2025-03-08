import {
  ConnectorConfiguration,
  IActionsConfiguration,
  IOppVCardConfiguration,
  IOpportunityDetailsConfiguration,
  ITabConfiguration
} from './detail.types';

export interface ICachedOpportunityDetails {
  VCardConfiguration: IOppVCardConfiguration[];
  TabConfiguration: ITabConfiguration[];
  ActionsConfiguration: IActionsConfiguration[];
  ConnectorConfiguration: ConnectorConfiguration;
  OpportunityDetailsConfiguration: IOpportunityDetailsConfiguration[];
}

export type ICachedOpportunityDetailsMap = Record<string, ICachedOpportunityDetails>;
