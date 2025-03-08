import {
  ActivityBaseAttributeDataType,
  DataType,
  EntityAttributeType,
  IEntityProperty,
  ILeadMetaData,
  RenderType
} from 'common/types/entity/lead/metadata.types';
import {
  ILead,
  ILeadAttribute,
  ILeadDetailsConfiguration,
  ISettingConfiguration,
  ITabConfiguration
} from 'common/types/entity/lead';
import { IVCardConfig } from './vcard.types';
import { ActionRenderType } from './action.types';
import { BadgeVariant } from './badge.types';
import { IconContentType } from './icon.types';
import { IConnectorConfig } from 'common/types/entity/lead';
import {
  IActionWrapperItem,
  IMenuItem
} from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { IActionHandler } from './action-handler.types';
import { IAttributeDetailsConfiguration } from 'common/types/entity/account/details.types';
import { IEntityIds, IEntityRepNames } from './entity-store.types';
import { EntityType, IOpportunity } from 'common/types';
import { EntityType as CustomActionEntityType } from 'common/utils/entity-data-manager/common-utils/common.types';
import { CallerSource } from 'common/utils/rest-client';
import { FeatureRestrictionModuleTypes } from 'common/utils/feature-restriction/feature-restriction.types';
import { IWithSuspense } from '@lsq/nextgen-preact/suspense/withSuspense';
import { ReactNode } from 'react';

interface IMetricsConfig {
  id: string;
  name: string;
  value: string | number;
}
interface IPropertiesConfig {
  entityProperty: IEntityProperty[];
  fields: Record<string, string | null>;
  entityConfig: { [key: string]: string | null };
  title?: string;
  editActionType?: EntityType;
  formTitle?: string;
  workAreaConfig?: IWorkAreaConfig;
  isAssociatedEntity?: boolean;
  featureRestrictionConfig?: IFeatureRestrictionConfig;
}

export interface IFeatureRestrictionConfig {
  moduleName: FeatureRestrictionModuleTypes;
  actionName: string;
  callerSource: CallerSource;
}

export type FeatureRestrictionConfigMap = Record<string, IFeatureRestrictionConfig>;

interface IInfoBoxPrimary {
  id: string;
  title: string;
  seperator: boolean;
  description: string;
}

interface IInfoBoxSecondary {
  title?: string;
  value?: number | string;
  description?: string;
  customStyle?: string;
  dependentComponent?: {
    isVisible: boolean;
    title: string;
  };
  CustomComponent?: JSX.Element;
}
interface IInfoBoxConfig {
  ListInfoBoxDetails?: {
    primary: IInfoBoxPrimary[];
    secondary: IInfoBoxSecondary[];
  };
}

interface ICustomConfig {
  CustomComponent: JSX.Element;
}

const enum TabType {
  System = 0,
  Connector,
  CustomActivity,
  // type 3 is added through LDVC
  CustomTab
}
interface ITabsConfig {
  id: string;
  name: string;
  isDefault: boolean;
  type: TabType;
  url?: string | null;
  activities?: string;
}
interface IIconConfig {
  content: string;
  contentType: IconContentType;
  iconElement?: JSX.Element;
  customStyleClass?: string;
}

interface ITitleConfig {
  content: string;
  className?: string;
  title?: string;
  CustomComponent?: JSX.Element;
}

interface IBadgeConfig {
  content: string;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
  tooltipContent?: string | JSX.Element;
}

export type IActionSubMenu = IActionMenuItem | IMenuItem;

interface IActionConfig {
  id: string;
  title: string;
  actionHandler?: IActionHandler;
  type?: ActionRenderType;
  sequence?: number;
  key?: string;
  connectorConfig?: IConnectorConfig;
  renderAsIcon?: boolean;
  disabled?: boolean;
  toolTip?: string;
  subMenu?: IActionSubMenu[];
  workAreaConfig?: IWorkAreaConfig;
  value?: string;
  hiddenActions?: Record<string, boolean>;
  formTitle?: string;
  formId?: string;
  isQuickAction?: boolean;
  label?: string;
  featureRestrictionConfig?: IFeatureRestrictionConfig;
  taskType?: string;
  entityType?: CustomActionEntityType;
  hideForInternalList?: boolean;
  customComponent?: ReactNode;
  isConnectorAction?: boolean;
}

interface IQuickActionConfig {
  name: string;
  icon: JSX.Element | string;
  onClick: () => void;
  workAreaConfig?: IWorkAreaConfig;
  id?: string;
  title?: string;
  formTitle?: string;
  featureRestrictionConfig?: IFeatureRestrictionConfig;
}

interface IMetaDataConfig extends ILeadAttribute {
  Value: string;
  onClick?: () => void;
  vCardDisplayName?: string;
  hideSeperator?: boolean;
  displayOrder?: number;
  JSXValue?: JSX.Element;
  valueCustomStyleClass?: string;
}

interface IActivityProcessBtnConfig {
  displayName: string;
  showAfterQuickAdd: boolean;
}

export interface IButtonAction extends IActionConfig {
  isLoading?: boolean;
  entityId?: string;
  showAsIcon?: boolean;
}

export type IActionMenuItem = IActionConfig & IMenuItem;

interface ISegregatedActions {
  buttonActions: IButtonAction[];
  moreActions: IActionMenuItem[];
}
export interface IAugmentedAction {
  actions: IActionConfig[];
  settingConfig?: ISettingConfiguration;
  featureRestrictionConfigMap?: FeatureRestrictionConfigMap;
}

export type IProcessConfig = { title: string; isProcessPresent: boolean };
interface IAssociatedEntityPropertyConfig {
  associatedProperties: string; //TODO
}

interface IAugmentedAttributeFields {
  id: string;
  name: string;
  value: string;
  fieldRenderType: RenderType;
  schemaName: string;
  dataType: DataType | ActivityBaseAttributeDataType;
  internalSchemaName?: string;
  displayValue?: string;
  colSpan?: number;
  cfsFields?: IAugmentedAttributeFields[];
  isMatched?: boolean;
  isRenderedInGrid?: boolean;
  doNotUseNameAsValue?: boolean;
  parentSchemaName?: string;
  isCFSField?: boolean;
  entityId?: string;
  isActivity?: boolean;
  leadId?: string;
  additionalData?: Record<string, string>;
  showAll?: boolean;
  removeDownloadOption?: boolean;
  entityAttributeType?: EntityAttributeType;
  eventCode?: string;
}

interface IAugmentedAttributes {
  id: string | undefined;
  name: string | undefined;
  fields: IAugmentedAttributeFields[] | null;
}

interface IAugmentedEntity {
  metrics?: IMetricsConfig[];
  properties: IPropertiesConfig;
  associatedEntityProperties?: IPropertiesConfig;
  associatedLeadProperties?: IPropertiesConfig;
  tabs: ITabConfiguration[];
  vcard: IVCardConfig;
  associatedEntityProperty?: IAssociatedEntityPropertyConfig;
  attributes: {
    detailsConfiguration: ILeadDetailsConfiguration | IAttributeDetailsConfiguration;
    fields: Record<string, string | null>;
    metadata: ILeadMetaData;
  };
  entityCode?: number;
  associatedEntityId?: string;
  associatedEntityRepName?: IEntityRepresentationName;
  autoId?: string;
  customMainComponent?: (props: IWithSuspense) => JSX.Element;
}

interface IEntityRepresentationName {
  SingularName: string;
  PluralName: string;
}

interface IOppRepresentationName {
  OpportunityRepresentationSingularName: string;
  OpportunityRepresentationPluralName: string;
}

const TIME_CONFIG = { NAME: 'Time', FORMAT: 'mm-hh:mm a' };

enum DateRenderType {
  Date = 'Date',
  Datetime = 'Datetime',
  Time = 'Time',
  DateWithTimezone = 'DateWithTimezone'
}

const DATE_AND_TIME_CONFIG = {
  NAME: 'Datetime',
  FORMAT: 'hh:mm:ss a'
};

type FormattedDate = {
  date: string;
  timeFormat?: string | undefined;
  dateTimeFormat?: string | undefined;
  timeZone?: string;
  customOptions?: Record<string, unknown>;
};

const SOCIAL_MEDIA = ['googleplusid', 'linkedinid', 'twitterid', 'facebookid', 'skypeid'];

enum SocialMediaSchema {
  GooglePlusId = 'googleplusid',
  LinkedInId = 'linkedinid',
  TwitterId = 'twitterid',
  FaceBookId = 'facebookid',
  SkypeId = 'skypeid'
}

const SOCIAL_MEDIA_SCHEMA_MAPPING = {
  facebookurl: SocialMediaSchema.FaceBookId,
  twitterurl: SocialMediaSchema.TwitterId,
  linkedinurl: SocialMediaSchema.LinkedInId,
  googleplusurl: SocialMediaSchema.GooglePlusId,
  skypeidurl: SocialMediaSchema.SkypeId
};

interface ISocialMediaConfig {
  renderIcon?: boolean;
  renderLink?: boolean;
}

interface IGetProcessActionConfig<T> {
  convertedAction: T & IActionWrapperItem;
  firstFormName: string;
  totalForms: number;
}

enum DefaultFormEntity {
  LEAD = 0,
  OPPORTUNITY = 1,
  ACTIVITY = 2,
  TASK = 3,
  AGENT = 4,
  ACCOUNT = 5,
  ACCOUNTACTIVITY = 6
}

enum ProcessType {
  ADDNEW = 0,
  VCARD = 1,
  QUICKADD = 2,
  VCARDPROPERTIES = 3,
  OPPORTUNITYRELATEDLEAD = 4
}

interface IEntityDetailsCoreData {
  tabId?: string;
  entityDetailsType: EntityType;
  entityIds: IEntityIds;
  entityRepNames: IEntityRepNames;
  eventCode?: number;
  entityName?: string;
  prospectAutoId?: string;
  entityTypeRepName?: string;
  leadType?: string;
  featureRestrictionConfigMap?: FeatureRestrictionConfigMap;
}

interface IAssociatedEntityDetails {
  entityId: string;
  entityType: EntityType;
  entityCode: string | number;
  entityName: string;
  entityPhoneNumber?: string;
  entityFirstName?: string;
  entityEmail?: string;
}
interface IGlobalSearchActionEntity {
  entityType: EntityType;
  entityRawData: ILead | IOpportunity | null;
  entityCode?: string;
}

export type {
  IGlobalSearchActionEntity,
  IAugmentedEntity,
  IMetricsConfig,
  IPropertiesConfig,
  ITabsConfig,
  IAssociatedEntityPropertyConfig,
  IActionConfig,
  IBadgeConfig,
  IIconConfig,
  ITitleConfig,
  IMetaDataConfig,
  IQuickActionConfig,
  FormattedDate,
  IActivityProcessBtnConfig,
  IEntityRepresentationName,
  ISegregatedActions,
  IAugmentedAttributes,
  ISocialMediaConfig,
  IAugmentedAttributeFields,
  IGetProcessActionConfig,
  IOppRepresentationName,
  IEntityDetailsCoreData,
  IAssociatedEntityDetails,
  IInfoBoxConfig,
  ICustomConfig
};

export { TabType, DefaultFormEntity, ProcessType };

export {
  TIME_CONFIG,
  DATE_AND_TIME_CONFIG,
  DateRenderType,
  SOCIAL_MEDIA,
  SocialMediaSchema,
  SOCIAL_MEDIA_SCHEMA_MAPPING
};
