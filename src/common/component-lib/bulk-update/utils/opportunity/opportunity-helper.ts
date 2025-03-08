import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  IBulkUpdateConfig,
  IBulkUpdateField,
  IDropdownOptionGet,
  IMetaDataGet
} from '../../bulk-update.types';
import opportunityDataManager from 'common/utils/entity-data-manager/opportunity';
import { API_ROUTES } from 'common/constants';
import { IOptions } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { ActivityBaseAttributeDataType } from 'common/types/entity/lead';
import { createAugmentedField, getAugmentedCustomFields } from '../common';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { EntityType } from 'common/types';
import { NAME_SUFFIX_FIELDS, SOURCE_FIELDS } from './constant';
import { safeParseJson } from 'common/utils/helpers';

const updateFieldProperty = (fieldConfig: IActivityAttribute): IActivityAttribute => {
  const field = safeParseJson(JSON.stringify(fieldConfig)) as IActivityAttribute;
  if (SOURCE_FIELDS.includes(field?.SchemaName)) {
    field.DisplayName = `Source - ${field.DisplayName}`;
  }

  if (NAME_SUFFIX_FIELDS.includes(field?.SchemaName)) {
    field.DisplayName = `${field.DisplayName} - Name`;
  }

  return field;
};

export const augmentedOpportunityFields = (fieldConfig: IActivityAttribute): IBulkUpdateField[] => {
  const field = updateFieldProperty(fieldConfig);

  if (field.DataType === ActivityBaseAttributeDataType.CustomObject) {
    if (!field?.CustomObjectMetaData?.Fields?.length) return [];
    return getAugmentedCustomFields({
      customFields: field?.CustomObjectMetaData,
      parentDisplayName: field?.DisplayName,
      entityType: EntityType.Opportunity
    });
  }

  return [createAugmentedField(field, EntityType.Opportunity)];
};

export const getOpportunityMetaData = async (
  eventCode: number,
  callerSource: CallerSource
): Promise<IMetaDataGet> => {
  const [metadataConfig] = await Promise.all([
    opportunityDataManager.fetchMetaData(callerSource, `${eventCode || ''}`)
  ]);

  return {
    //Fields property is metadata map
    metaDataMap: Object.values(metadataConfig.Fields || {}),
    repName: {
      PluralName: metadataConfig?.PluralName || 'Opportunities',
      SingularName: metadataConfig?.DisplayName || 'Opportunity'
    }
  };
};

export const getOpportunityBulkUpdateConfig = async ({
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
    body: { EventCode: eventCode, IsOpportunity: true }
  })) as IBulkUpdateConfig;
};

export const opportunityDropdownOptionGet = async (
  config: IDropdownOptionGet
): Promise<IOptions> => {
  try {
    const utils = await import('common/utils/entity-data-manager/opportunity/dropdown-options');
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
