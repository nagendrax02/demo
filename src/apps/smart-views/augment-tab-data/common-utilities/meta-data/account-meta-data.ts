import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'common/utils/rest-client';
import accountDataManager from 'common/utils/entity-data-manager/account';
import { ConditionEntityType, SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IAccountMetaDataMap } from 'common/types/entity';
import { IAccountAttribute } from 'common/types/entity/account/metadata.types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getAccountRepresentationNameCache } from 'common/utils/entity-data-manager/account/metadata';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';

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
    isSortable: currentMetadata.IsSortable,
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    parentField: currentMetadata?.ParentField,
    conditionEntityType: ConditionEntityType.Account,
    BaseTable: currentMetadata?.BaseTable,
    GroupName: currentMetadata?.GroupName
  };

  return metadata;
};

// eslint-disable-next-line max-lines-per-function
const getAugmentedSmartViewsAccountMetaData = (
  accountMetadata: IAccountMetaDataMap
): {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
} => {
  if (!accountMetadata) {
    return { metaDataMap: {} };
  }
  const metaDataMap = Object.values(accountMetadata)?.reduce(
    // eslint-disable-next-line max-lines-per-function, complexity
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: IAccountAttribute
    ) => {
      const schema = currentMetadata?.SchemaName;
      allMetadata[schema] = getMetaData({
        ...currentMetadata
      });

      if (schema === SCHEMA_NAMES.CREATED_BY) {
        allMetadata[SCHEMA_NAMES.CREATED_BY_NAME] = {
          ...(allMetadata[SCHEMA_NAMES.CREATED_BY] || {}),
          schemaName: SCHEMA_NAMES.CREATED_BY_NAME
        };
        delete allMetadata[SCHEMA_NAMES.CREATED_BY];
      }

      if (schema === SCHEMA_NAMES.MODIFIED_BY) {
        allMetadata[SCHEMA_NAMES.MODIFIED_BY_NAME] = {
          ...(allMetadata[SCHEMA_NAMES.MODIFIED_BY] || {}),
          schemaName: SCHEMA_NAMES.MODIFIED_BY_NAME
        };
        delete allMetadata[SCHEMA_NAMES.MODIFIED_BY];
      }

      if (schema === SCHEMA_NAMES.COMPANY_NAME) {
        allMetadata[SCHEMA_NAMES.ACCOUNT_IDENTIFIER] = {
          ...(allMetadata[SCHEMA_NAMES.COMPANY_NAME] || {}),
          schemaName: SCHEMA_NAMES.ACCOUNT_IDENTIFIER
        };
        delete allMetadata[SCHEMA_NAMES.COMPANY_NAME];
      }

      if (schema === SCHEMA_NAMES.OWNER_ID) {
        allMetadata[SCHEMA_NAMES.OWNER_NAME] = {
          schemaName: SCHEMA_NAMES.OWNER_NAME,
          displayName: allMetadata[SCHEMA_NAMES.OWNER_ID].displayName || 'Account Owner',
          dataType: DataType.Text,
          renderType: RenderType.Textbox,
          isSortable: true
        };
      }

      return allMetadata;
    },
    {}
  );
  return {
    metaDataMap
  };
};

export const fetchSmartViewAccountMetadata = async (
  code: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  try {
    const accountMetaDataMap: IAccountMetaDataMap =
      (await accountDataManager.fetchMetaData(CallerSource.SmartViews, code)) || {};

    const { metaDataMap } = getAugmentedSmartViewsAccountMetaData(accountMetaDataMap);

    const config = {
      metaDataMap,
      representationName:
        getAccountRepresentationNameCache(code) || DEFAULT_ENTITY_REP_NAMES.account
    };
    return config as {
      metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
      representationName: IEntityRepresentationName;
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {}, representationName: DEFAULT_ENTITY_REP_NAMES.account };
};
