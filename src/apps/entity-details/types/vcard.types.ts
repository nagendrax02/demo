import {
  IAugmentedAction,
  IBadgeConfig,
  ICustomConfig,
  IIconConfig,
  IInfoBoxConfig,
  IMetaDataConfig,
  IQuickActionConfig,
  ITitleConfig
} from './entity-data.types';

enum ComponentType {
  Icon,
  Title,
  QuickAction,
  Badge,
  Action,
  MetaData,
  InfoBox,
  CustomComponent
}

export type IConfig =
  | IIconConfig
  | ITitleConfig
  | IBadgeConfig
  | IAugmentedAction
  | IMetaDataConfig[]
  | IQuickActionConfig[]
  | IInfoBoxConfig
  | ICustomConfig;

interface IComponent {
  type: ComponentType;
  config: IConfig;
  customStyleClass?: string;
  showFieldSeperator?: boolean;
}

interface ISection {
  components: IComponent[];
  customStyleClass?: string;
}

interface IBodyConfig {
  icon: IIconConfig;
  primarySection: ISection;
  secondarySection: ISection;
  tertiarySection?: ISection;
}

interface IFooterConfig {
  components: IComponent[];
  customStyleClass?: string;
}

interface IVCardConfig {
  body: IBodyConfig;
  footer?: IFooterConfig;
}

export type { IComponent, ISection, IVCardConfig, IBodyConfig, IFooterConfig, IMetaDataConfig };
export { ComponentType };
