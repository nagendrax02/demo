interface ILeadDetails {
  Fields: Record<string, string | null>;
  VCardConfiguration: IVCardConfiguration;
  ActionsConfiguration: IActionConfiguration[];
  TabsConfiguration: ITabConfiguration[];
  LeadDetailsConfiguration: ILeadDetailsConfiguration;
  ConnectorConfiguration: IConnectorConfiguration;
  SettingConfiguration?: ISettingConfiguration;
}

interface IVCardConfiguration {
  DisplayName: string;
  Sections: ISection[];
  Name?: string;
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

interface ITabConfiguration {
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

interface ILeadDetailsConfiguration {
  Sections: (ISection & { DispositionField: string })[];
}

type IConnectorConfiguration = Record<string, IConnectorConfig[]>;

interface ISettingConfiguration {
  ActivityProcessBtnConfig?: string;
  DisableQuickAddActivityBtn?: string;
  isSettingApplied?: boolean;
  IsConverseLeadWidgetEnabled?: string;
}

interface IField {
  DisplayName: string;
  SchemaName: string;
  ColSpan: string;
  Fields: IField[];
}

interface ISection {
  Name?: string;
  DisplayName: string;
  CanModify?: boolean;
  Fields: IField[];
}

interface IConnectorConfig {
  Id: string;
  InstanceId: string;
  InstanceSpecific: boolean;
  ShowInMobile: boolean;
  ShowInWeb: boolean;
  Category: string;
  ActivityType?: string;
  OpportunityType?: string;
  Config: IConnectorAction;
  TaskType?: string;
}

interface IConnectorAction {
  IsEnabled: boolean;
  DisplayText: string;
  RestrictedRoles: string;
  Action: string;
  ActionConfig: IConnectorActionConfig;
}

interface IConnectorActionConfig {
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

interface ILeadDetailsRequest {
  Id: string;
  CanGetFormConfiguration: boolean;
  CanGetTabConfiguration: boolean;
  CanGetActionConfiguration: boolean;
  CanGetSettingConfiguration: boolean;
}

export type {
  ILeadDetails,
  IActionConfiguration,
  IVCardConfiguration,
  ITabConfiguration,
  ILeadDetailsConfiguration,
  ISettingConfiguration,
  IConnectorConfiguration,
  IField,
  ISection,
  IConnectorConfig,
  IConnectorAction,
  IConnectorActionConfig,
  ILeadDetailsRequest
};
