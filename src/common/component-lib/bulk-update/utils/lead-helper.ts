import { trackError } from 'common/utils/experience/utils/track-error';
import { ILeadAttribute, DataType } from 'common/types/entity/lead';
import { getAugmentedCustomFields, createAugmentedField } from './common';
import { EntityType } from 'common/types';
import {
  IBulkUpdateConfig,
  IBulkUpdateField,
  IDropdownOptionGet,
  IMetaDataField,
  ISettings
} from '../bulk-update.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import {
  fetchMetaData,
  fetchRepresentationName
} from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { IOptions } from 'src/common/utils/entity-data-manager/entity-data-manager.types';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

export const augmentedLeadFields = (field: ILeadAttribute): IBulkUpdateField[] => {
  if (field.DataType === DataType.CustomObject) {
    if (!field?.CustomObjectMetaData?.Fields?.length) return [];
    return getAugmentedCustomFields({
      customFields: field?.CustomObjectMetaData,
      parentDisplayName: field?.DisplayName,
      entityType: EntityType.Lead
    });
  }

  return [createAugmentedField(field, EntityType.Lead)];
};

export const getLeadBulkUpdateConfig = async ({
  callerSource
}: {
  callerSource: CallerSource;
}): Promise<IBulkUpdateConfig> => {
  return (await httpGet({
    path: API_ROUTES.leadBulkUpdateConfigGet,
    module: Module.Marvin,
    callerSource
  })) as IBulkUpdateConfig;
};

export const getLeadMetaData = async (
  callerSource: CallerSource,
  leadTypeConfiguration?: ILeadTypeConfiguration[]
): Promise<{
  metaDataMap: IMetaDataField[];
  repName: IEntityRepresentationName;
}> => {
  let representationName = {
    PluralName: 'Leads',
    SingularName: 'Lead'
  };
  const leadType = leadTypeConfiguration?.[0]?.LeadTypeInternalName;
  const metaData = await fetchMetaData(callerSource, leadType);
  representationName =
    (await fetchRepresentationName(callerSource, leadType)) || representationName;

  return { metaDataMap: Object.values(metaData), repName: representationName };
};

export const getBulkUpdateSettingsConfig = (config: ISettings): ISettings => {
  const { BulkLeadUpdateCount, EnableNLeadsFeature, MaxNLeadsToUpdateInSync } = config;
  return {
    BulkLeadUpdateCount: !Number(BulkLeadUpdateCount) ? '25000' : BulkLeadUpdateCount,
    EnableNLeadsFeature: !Number(EnableNLeadsFeature) ? '0' : EnableNLeadsFeature,
    MaxNLeadsToUpdateInSync: !Number(MaxNLeadsToUpdateInSync) ? '200' : MaxNLeadsToUpdateInSync
  };
};

export const leadDropdownOptionGet = async (config: IDropdownOptionGet): Promise<IOptions> => {
  try {
    const getDropdownOptions = await import(
      'common/utils/entity-data-manager/lead/dropdown-options'
    );
    const { customObjectSchemaName, schemaName, searchText } = config;
    const isTimeZone = schemaName === 'TimeZone';

    const options = await getDropdownOptions?.default({
      body: {
        schemaName: schemaName as string,
        searchText: searchText,
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
