import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { CallerSource } from 'common/utils/rest-client';
import { ActivityBaseAttributeDataType, RenderType } from 'common/types/entity/lead';
import metaDataManager from 'common/utils/entity-data-manager/opportunity';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { ConditionEntityType } from 'apps/smart-views/constants/constants';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { CanAddSourcePrefix, OPP_SCHEMA_NAMES } from '../constants';

const getCustomObjectMetaData = (
  currentMetadata: IActivityAttribute,
  allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>
): void => {
  if (currentMetadata?.CustomObjectMetaData?.Fields?.length) {
    currentMetadata?.CustomObjectMetaData?.Fields?.forEach((cfsMetaData) => {
      const cfsSchemaName = `${currentMetadata?.SchemaName}~${cfsMetaData?.SchemaName}`;
      allMetadata[cfsSchemaName] = {
        schemaName: cfsSchemaName,
        displayName: `${currentMetadata?.DisplayName} - ${cfsMetaData?.DisplayName}`,
        renderType: (cfsMetaData?.RenderType || cfsMetaData?.DataType) as RenderType,
        cfsDisplayName: cfsMetaData?.DisplayName,
        isCFS: true,
        isSortable: false,
        parentSchemaName: currentMetadata?.SchemaName,
        dataType: cfsMetaData?.DataType,
        parentField: cfsMetaData?.ParentField,
        conditionEntityType: ConditionEntityType.Opportunity
      };
    });
  }
};

const getMetaData = (currentMetadata: IActivityAttribute): IAugmentedSmartViewEntityMetadata => {
  const metadata = {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType: (currentMetadata?.RenderType || currentMetadata?.DataType) as RenderType,
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField,
    conditionEntityType: ConditionEntityType.Opportunity,
    IsMultiSelectDropdown: currentMetadata?.IsMultiSelectDropdown
  };

  return metadata;
};

// eslint-disable-next-line max-lines-per-function
const getAugmentedSmartViewsOppMetaData = (
  oppMetadata: Record<string, IActivityAttribute>
): {
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
} => {
  if (!oppMetadata) {
    return { metaDataMap: {} };
  }
  const augmentedOppMetadata = Object.values(oppMetadata)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: IActivityAttribute
    ) => {
      let displayName = currentMetadata?.DisplayName;
      if (currentMetadata?.DataType === ActivityBaseAttributeDataType.Product) {
        currentMetadata.RenderType = RenderType.Product;
      }
      if (currentMetadata?.SchemaName === 'Status') {
        currentMetadata.RenderType = RenderType.OppStatusHighlighted;
      }

      if (CanAddSourcePrefix[currentMetadata?.SchemaName]) {
        displayName = `Source - ${displayName}`;
      } else if (currentMetadata?.SchemaName === OPP_SCHEMA_NAMES.Source) {
        displayName = `${displayName} - Name`;
      }

      if (currentMetadata?.DataType === ActivityBaseAttributeDataType.CustomObject) {
        getCustomObjectMetaData(currentMetadata, allMetadata);
        return allMetadata;
      }
      allMetadata[currentMetadata?.SchemaName] = getMetaData({
        ...currentMetadata,
        DisplayName: displayName
      });

      return allMetadata;
    },
    {}
  );
  return {
    metaDataMap: augmentedOppMetadata
  };
};

export const fetchSmartViewOppMetadata = async (
  code: string,
  callerSource: CallerSource
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  try {
    const response = await metaDataManager.fetchMetaData(callerSource, code);
    const { metaDataMap } = getAugmentedSmartViewsOppMetaData(response?.Fields || {});

    return {
      metaDataMap,
      representationName: {
        SingularName: response?.DisplayName || DEFAULT_ENTITY_REP_NAMES.opportunity.SingularName,
        PluralName: response?.PluralName || DEFAULT_ENTITY_REP_NAMES.opportunity.PluralName
      }
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {}, representationName: DEFAULT_ENTITY_REP_NAMES.opportunity };
};
