import { EntityType, ILead } from 'src/common/types';
import { ILeadDetails } from 'src/common/types/entity/lead/detail.types';
import React from 'react';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';
export type IColorSchema = 'primary' | 'secondary';

export enum EmptyStateType {
  SomethingWentWrong = 'SomethingWentWrong',
  NoResultsFound = 'NoResultsFound',
  AccessDenied = 'AccessDenied',
  FirstSearch = 'FirstSearch'
}
export interface IEmptyStateConfig {
  Icon: React.ComponentType;
  heading: string;
  subHeading: string;
  additionalComponent?: React.ReactNode;
}

export interface IEmptyStateProps {
  type: EmptyStateType;
}
export interface IDefaultEntityConfig {
  buttonText: string;
  modalTitle: string;
  id: string;
}

export type EntityDetails = ILeadDetails;

export enum IconType {
  Text,
  Icon
}

export type EntityRawData = ILead;

export type GetActionsFunction<T> = (entityData: T) => unknown;

enum BadgeVariant {
  Primary = 'primary',
  Secondary = 'secondary'
}

export interface ITitleConfig {
  content: string;
  className?: string;
  title?: string;
  CustomComponent?: React.ReactNode;
}
export interface IMetricsConfig {
  id: string;
  name: string;
  value: string | number;
}
export interface IBadgeConfig {
  content: string;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
  tooltipContent?: string | React.ReactNode;
}
export type IIconConfig = {
  icon?: React.ReactNode;
  subIcon: React.ReactNode;
  customClassName?: string;
};

export enum ComponentType {
  Title,
  Badge,
  Actions
}

export type IComponentConfig = ITitleConfig | IBadgeConfig | React.ReactNode;

export interface IComponent {
  type: ComponentType;
  data: IComponentConfig;
}

export interface ISectionConfig {
  components: IComponent[];
  customStyleClass?: string;
}

export interface IVCardConfig {
  Icon: IIconConfig;
  Header?: ISectionConfig;
  Body: ISectionConfig;
  Footer: React.ReactNode;
  customStyleClass?: string;
}

export enum TabType {
  Properties,
  Activities,
  Notes
}

export interface IProperty {
  label: string;
  value: string;
}

export interface IPropertyTabData {
  metricData?: IMetricsConfig[];
  properties: React.ReactNode;
  propertiesHeading: string;
}

export type ITabData = IPropertyTabData;

export interface ITabConfig {
  id: string;
  title: string | JSX.Element;
  content: JSX.Element;
}

export interface IEntityParams {
  entityType: EntityType;
  entityId: string;
  details: EntityDetails;
  entityRawData: EntityRawData;
}

export interface ILeadParams {
  leadDetails: ILeadDetails;
  leadId: string;
  entityRawData: ILead;
}

export type EntityKeys = 'Leads';
export interface IPropertyList {
  Attribute: string;
  Value: null | string;
  Fields: null;
}

export interface ISearchResultBase {
  TotalRecords: number;
}

export interface ISearchRecord {
  EntityType: EntityType;
  [key: string]: unknown;
}

export interface ISearchResult {
  TotalRecords: number;
  Data: ISearchRecord[];
}

export interface IRecentSearchResultsProps {
  data: ISearchResult;
  focusedIndex?: number;
}

export interface IRecentSearchCardLayout {
  heading: IHeading;
  description: IDescription[];
  ownerName: IDescription;
  uniqueIdentifier: string;
  redirectUrl?: string;
  redirectionHandler?: () => void;
}
type TagType = 'badge' | 'icon';
export interface ITag {
  id: number;
  type: TagType;
  value: string;
  icon?: React.ReactNode;
  status?: BadgeStatus;
  attribute: string;
  className?: string;
}

export interface IHeading {
  icon: React.ReactNode;
  iconTooltipAttribute: string;
  iconTooltipText: string;
  iconTooltipFallBack: string;
  value: string;
  tags: ITag[];
  attribute: string[] | string;
}

export interface IDescription {
  value: string;
  color?: string;
  icon?: React.ReactNode;
  iconTooltipText?: string;
  attribute: string;
  customClassName?: string;
  customElement?: React.ReactNode;
}

export type EntityApiMap = {
  [EntityType.Lead]: (customLeadId?: string) => Promise<ILead>;
};
export type EntityDetailsResult = ILead;

export type LeadTypeMap = Record<string, { value: string; label: string }>;
