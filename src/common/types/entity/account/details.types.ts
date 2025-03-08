import { ITabConfiguration, IVCardConfiguration } from '../lead';

export interface IAttributeDetailsConfiguration {
  Sections: ISection[];
}

export interface ISection {
  Name: string;
  Fields: IField[];
}

export interface IField {
  DisplayName: string;
  SchemaName: string;
  ColSpan: string;
}

interface IActionConfiguration {
  Name: string;
  Title: string;
  Type: string;
  Sequence: number;
  IsConnectorAction: boolean;
  ConnectorCategory: string;
  RenderAsIcon?: boolean;
}

export interface IAccountTabsConfiguration extends ITabConfiguration {
  Consumer?: null;
  AdvanceFilter?: null;
}

interface IAccountDetails {
  AccountTypeId: string;
  AccountTypeName: string;
  ActionsConfiguration: IActionConfiguration[];
  Fields: Record<string, string | null>;
  AttributeDetailsConfiguration: IAttributeDetailsConfiguration;
  LeadId: string;
  PropertiesConfiguration: IAttributeDetailsConfiguration;
  ShouldApplyPermissionTemplate: boolean;
  TabsConfiguration: IAccountTabsConfiguration[];
  VCardConfiguration: IVCardConfiguration;
}

interface IAccountDetailsRequest {
  AccountId: string;
  CanGetFormConfiguration: boolean;
  CanGetTabConfiguration: boolean;
  CanGetActionConfiguration: boolean;
}

interface IAccountLeads {
  ProspectID: string;
  Total: string;
  CanUpdate: string;
}

export type { IAccountDetails, IAccountDetailsRequest, IActionConfiguration, IAccountLeads };
