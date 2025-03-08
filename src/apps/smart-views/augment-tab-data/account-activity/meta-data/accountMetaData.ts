import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import accountDataManager from 'common/utils/entity-data-manager/account';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { CallerSource } from 'common/utils/rest-client';
import { IAccountMetaDataMap } from 'common/types/entity';
import {
  ACCOUNT_SCHEMA_PREFIX,
  ConditionEntityType,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';
import { DataType, RenderType } from 'common/types/entity/lead';
import { IAccountAttribute } from 'common/types/entity/account/metadata.types';
import { getAccountRepresentationNameCache } from 'common/utils/entity-data-manager/account/cache-metadata';
import { ADDRESS } from 'apps/smart-views/components/smartview-tab/components/tab-settings/constants';

const getMetaData = (currentMetadata: IAccountAttribute): IAugmentedSmartViewEntityMetadata => {
  const renderType =
    currentMetadata?.RenderType === RenderType.Email ||
    currentMetadata?.RenderType === RenderType.Phone
      ? RenderType.Text
      : currentMetadata?.RenderType;
  const dataType =
    currentMetadata?.DataType === DataType.Email || currentMetadata?.DataType === DataType.Phone
      ? DataType.Text
      : currentMetadata?.DataType;

  const metadata = {
    dataType,
    renderType,
    isSortable:
      currentMetadata?.SchemaName === SCHEMA_NAMES.OWNER_ID ? true : currentMetadata.IsSortable,
    schemaName: `${ACCOUNT_SCHEMA_PREFIX}${currentMetadata?.SchemaName}`,
    displayName: currentMetadata?.DisplayName,
    parentField: currentMetadata?.ParentField,
    conditionEntityType: ConditionEntityType.Account,
    BaseTable: currentMetadata?.BaseTable,
    GroupName: currentMetadata?.GroupName
  };

  if (
    [SCHEMA_NAMES.OWNER_ID, SCHEMA_NAMES.MODIFIED_BY, SCHEMA_NAMES.CREATED_BY].includes(
      currentMetadata?.SchemaName
    )
  ) {
    metadata.dataType = DataType.ActiveUsers;
    metadata.renderType = RenderType.ActiveUsers;
  }
  return metadata;
};

const canExcludeField = (field: IAccountAttribute): boolean => {
  return field.DataType === DataType.GeoLocation ? !field.GroupName?.includes(ADDRESS) : false;
};

const getAugmentedAccountMetaData = (
  accountMetadata: IAccountMetaDataMap
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  if (!accountMetadata) {
    return {};
  }

  return Object.values(accountMetadata)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadataField: IAccountAttribute
    ) => {
      const schema = `${ACCOUNT_SCHEMA_PREFIX}${currentMetadataField?.SchemaName}`;
      if (canExcludeField(currentMetadataField)) return allMetadata;

      allMetadata[schema] = getMetaData(currentMetadataField);

      return allMetadata;
    },
    {}
  );
};

export const getAccountMetaData = async (
  code: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  try {
    const accountMetaDataMap: IAccountMetaDataMap =
      (await accountDataManager.fetchMetaData(CallerSource.SmartViews, code)) || {};

    const metaDataMap = getAugmentedAccountMetaData(accountMetaDataMap);

    return {
      metaDataMap,
      representationName:
        getAccountRepresentationNameCache(code) || DEFAULT_ENTITY_REP_NAMES.account
    };
  } catch (error) {
    trackError(error);
  }

  return { metaDataMap: {}, representationName: DEFAULT_ENTITY_REP_NAMES.account };
};
