import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IActivityAttribute } from '../../../utils/entity-data-manager/activity/activity.types';
import { ILead, ILeadAttribute } from '../lead';

export interface IOpportunityDetails {
  EntityAttribute: Record<string, IActivityAttribute>;
  OppRepresentationName: IOppRepresentationName;
  VCardConfiguration: IOppVCardConfiguration[];
  TabConfiguration: ITabConfiguration[];
  ActionsConfiguration: IActionsConfiguration[];
  ConnectorConfiguration: ConnectorConfiguration;
  Fields: Record<string, string | null>;
  DisplayName: string;
  Name: string;
  IsEditable: boolean;
  VCardColor: string;
  OpportunityDetailsConfiguration: IOpportunityDetailsConfiguration[];
  IsRestricted?: boolean;
  CanDelete?: boolean;
  ProspectActivityAutoId?: number;
  LeadId: string | undefined;
  EventCode: number | undefined;
  LeadRepresentationName?: IEntityRepresentationName;
  EntityDetailsViewId?: string;
  AssociatedLeadData?: ILead;
  RelatedProspectId?: string;
}

export interface IAssociatedLeadData {
  EntityAttribute: ILeadAttribute[];
  Fields: Record<string, string | null>;
}
export interface IOppRepresentationName {
  Singular: string;
  Plural: string;
}

export interface IOppVCardConfiguration {
  DisplayName: string | null;
  Fields: {
    Colspan: number;
    SchemaName: string;
  }[];
}

export interface ITabConfiguration {
  Id: string;
  RestrictedRoles?: [] | null;
  Type: number;
  IsEnabled: boolean;
  ShowInWeb?: boolean;
  ShowInMobile?: boolean;
  EntityType?: string | number | null;
  TabConfiguration: {
    Title: string;
    Position?: number;
    TabPosition?: number;
    Location?: string | number | null;
    Sequence: number;
    IsDefault: boolean;
    ShowInForm?: boolean;
  };
  TabContentConfiguration: {
    Title: string;
    URL?: string | null;
    Height?: string | number | null;
    Width?: string | number | null;
    Activities?: string;
    From?: string;
    To?: string;
    CanEdit?: boolean;
    CanDelete?: boolean;
    CanClone?: boolean;
    IsHidden?: boolean;
    CanHide?: boolean;
    OptFilter?: string;
    OnClick?: string;
    LeadFilter?: string | null;
  };
  LastUpdatedOn?: string | null;
}

export interface IActionsConfiguration {
  Name: string;
  Title: string;
  Type: string;
  Sequence: number;
  IsConnectorAction: boolean;
  ConnectorCategory: string;
  RenderAsIcon?: boolean;
}

export interface IConnectorConfig {
  Id: string;
  InstanceId: string;
  InstanceSpecific: boolean;
  ShowInMobile: boolean;
  ShowInWeb: boolean;
  Category: string;
  Config: IConnectorAction;
}

export interface IConnectorAction {
  IsEnabled: boolean;
  DisplayText: string;
  RestrictedRoles: string;
  Action: string;
  ActionConfig: IConnectorActionConfig;
}

export interface IConnectorActionConfig {
  URL: string;
  Method: string;
  ContentType: string;
  Data: string;
  HelpUrl: string;
  Height: string;
  Width: string;
  Name: string;
  Specs: string;
  Title: string;
  IframeAttribute: string;
}

export type ConnectorConfiguration = Record<string, IConnectorConfig[]>;

export interface IField {
  [key: string]: string;
  DisplayName: string;
  SchemaName: string;
  Colspan: string;
}

export interface IOpportunityDetailsConfiguration {
  DisplayName: string;
  Fields: IField[];
}

export interface IOpportunityDetailsRequest {
  ActivityId: string;
  CanGetFormConfiguration: boolean;
  CanGetTabConfiguration: boolean;
  CanGetActionConfiguration: boolean;
}
