import {
  ILeadDetails,
  IActionConfiguration,
  IConnectorConfiguration,
  ILeadDetailsConfiguration,
  ISettingConfiguration,
  ITabConfiguration,
  IVCardConfiguration,
  IField,
  ISection,
  IConnectorConfig,
  IConnectorAction,
  IConnectorActionConfig,
  ILeadDetailsRequest
} from './detail.types';
import {
  ILeadMetaData,
  ILeadAttribute,
  DataType,
  RenderType,
  ILOSProperties,
  ILeadMetadataMap,
  ICustomObjectMetaData,
  ICustomObjectAttribute,
  IActivityBaseAttribute,
  ActivityBaseAttributeDataType
} from './metadata.types';
import { ILead } from './lead.types';
import { ICachedLeadDetails } from './cache.types';

export type {
  ILead,
  ILeadDetails,
  IActionConfiguration,
  IConnectorConfiguration,
  ILeadDetailsConfiguration,
  ISettingConfiguration,
  ITabConfiguration,
  IVCardConfiguration,
  IField,
  ISection,
  IConnectorConfig,
  IConnectorAction,
  ILeadMetadataMap,
  IConnectorActionConfig,
  ILeadMetaData,
  ILeadAttribute,
  ILOSProperties,
  ICustomObjectMetaData,
  ICustomObjectAttribute,
  IActivityBaseAttribute,
  ILeadDetailsRequest,
  ICachedLeadDetails
};

export { DataType, RenderType, ActivityBaseAttributeDataType };
