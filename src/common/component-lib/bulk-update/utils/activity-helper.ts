import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  IBulkUpdateConfig,
  IBulkUpdateField,
  IDropdownOptionGet,
  IMetaDataGet,
  Schema
} from '../bulk-update.types';
import activityDataManager from 'common/utils/entity-data-manager/activity';
import { API_ROUTES } from 'common/constants';
import { IOptions } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { ActivityBaseAttributeDataType, RenderType } from 'common/types/entity/lead';
import { createAugmentedField, getAugmentedCustomFields } from './common';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { EntityType } from 'common/types';
import { UNSUPPORTED_ACTIVITY_NOTE } from '../constant';

export const augmentedActivityFields = (field: IActivityAttribute): IBulkUpdateField[] => {
  if (field.DataType === ActivityBaseAttributeDataType.CustomObject) {
    if (!field?.CustomObjectMetaData?.Fields?.length) return [];
    return getAugmentedCustomFields({
      customFields: field?.CustomObjectMetaData,
      parentDisplayName: field?.DisplayName,
      entityType: EntityType.Activity
    });
  }

  return [createAugmentedField(field, EntityType.Activity)];
};

const getMetaData = (
  metaDataMap: Record<string, IActivityAttribute>,
  entityCode: number
): IActivityAttribute[] => {
  const isPresent = Object.keys(metaDataMap)?.some((filter) => filter === Schema.ActivityEventNote);
  const metaData = Object.values(metaDataMap || {});

  if (isPresent) return metaData;

  if (!UNSUPPORTED_ACTIVITY_NOTE[Number(entityCode)])
    metaData?.unshift({
      SchemaName: Schema.ActivityEventNote,
      DisplayName: 'Notes',
      DataType: ActivityBaseAttributeDataType.String,
      InternalSchemaName: Schema.ActivityEventNote,
      RenderType: RenderType.TextArea,
      IsMultiSelectDropdown: false,
      CustomObjectMetaData: {}
    });
  return metaData;
};
export const getActivityMetaData = async (
  eventCode: number,
  callerSource: CallerSource
): Promise<IMetaDataGet> => {
  const metaData = await activityDataManager.fetchMetaData(eventCode, callerSource);

  return {
    metaDataMap: getMetaData(metaData?.metaDataMap || {}, eventCode),
    repName: {
      PluralName: 'Activities',
      SingularName: 'Activity'
    }
  };
};

export const getActivityBulkUpdateConfig = async ({
  callerSource,
  eventCode
}: {
  eventCode: number;
  callerSource: CallerSource;
}): Promise<IBulkUpdateConfig> => {
  return (await httpPost({
    path: API_ROUTES.activityBulkUpdateConfigGet,
    module: Module.Marvin,
    callerSource,
    body: { EventCode: eventCode, IsOpportunity: false }
  })) as IBulkUpdateConfig;
};

export const activityDropdownOptionGet = async (config: IDropdownOptionGet): Promise<IOptions> => {
  try {
    const utils = await import('common/utils/entity-data-manager/activity/dropdown-options');
    const { customObjectSchemaName, schemaName, searchText, code } = config;
    const isTimeZone = schemaName === 'TimeZone';

    const options = await utils?.getDropdownOptions?.({
      body: {
        schemaName: schemaName as string,
        searchText: searchText,
        code: code || '',
        count: isTimeZone ? 80 : undefined,
        customObjectSchemaName
      },
      callerSource: CallerSource.BulkUpdate
    });
    return options;
  } catch (error) {
    trackError(error);
  }
  return [];
};
