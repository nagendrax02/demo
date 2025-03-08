import { CallerSource } from 'common/utils/rest-client';
import { ILeadMetadataMap } from 'common/types';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import {
  fetchMetaData,
  fetchRepresentationName
} from 'common/utils/entity-data-manager/lead/metadata';
import { customMetaDataForLead } from '../helpers';
import {
  ConditionEntityType,
  DISPLAY_NAME,
  GROUPS,
  SCHEMA_NAMES
} from '../../../constants/constants';
import { CAN_PREFIX_LEAD_REP_NAME, leadSchemaNamePrefix } from '../constants';
import { IAugmentedSmartViewEntityMetadata } from '../../common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { getLDTypeConfigFromRawData } from '../../common-utilities/utils';

const getCustomObjectMetaData = (
  currentMetadata: ILeadAttribute,
  allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>
): void => {
  if (currentMetadata?.CustomObjectMetaData?.Fields?.length) {
    currentMetadata?.CustomObjectMetaData?.Fields?.forEach((cfsMetaData) => {
      const cfsSchemaName = `${leadSchemaNamePrefix}${currentMetadata?.SchemaName}~${cfsMetaData?.SchemaName}`;
      allMetadata[cfsSchemaName] = {
        schemaName: cfsSchemaName,
        displayName: `${currentMetadata?.DisplayName} - ${cfsMetaData?.DisplayName}`,
        renderType: (cfsMetaData?.RenderType || cfsMetaData?.DataType) as RenderType,
        cfsDisplayName: cfsMetaData?.DisplayName,
        isCFS: true,
        parentSchemaName: currentMetadata?.SchemaName,
        dataType: cfsMetaData?.DataType,
        parentField: cfsMetaData?.ParentField,
        conditionEntityType: ConditionEntityType.Lead
      };
    });
  }
};

const getMetaData = (currentMetadata: ILeadAttribute): IAugmentedSmartViewEntityMetadata => {
  return {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType: currentMetadata?.RenderType,
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField,
    isSortable: currentMetadata?.IsSortable,
    conditionEntityType: ConditionEntityType.Lead
  };
};

const getAugmentedLeadMetadata = (
  leadMetadata: ILeadMetadataMap,
  leadSingularName: string
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  if (!leadMetadata) {
    return {};
  }

  const augmentedLeadMetadata = Object.values(leadMetadata)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: ILeadAttribute
    ) => {
      const schema = currentMetadata?.SchemaName;
      let displayName = currentMetadata?.DisplayName;

      if (CAN_PREFIX_LEAD_REP_NAME[schema]) {
        displayName = `${leadSingularName} ${displayName}`;
      }

      if (currentMetadata?.DataType === DataType.CustomObject) {
        getCustomObjectMetaData(currentMetadata, allMetadata);
        return allMetadata;
      } else if (schema === GROUPS) {
        displayName = DISPLAY_NAME.SALES_GROUP;
      } else if ([SCHEMA_NAMES.OWNER_ID, SCHEMA_NAMES.OWNER_ID_NAME].includes(schema)) {
        displayName = `${leadSingularName} Owner`;
      }

      const prefixedSchema = `${leadSchemaNamePrefix}${schema}`;
      allMetadata[prefixedSchema] = {
        ...getMetaData({
          ...currentMetadata,
          DisplayName: displayName,
          SchemaName: prefixedSchema
        })
      };

      return allMetadata;
    },
    {}
  );
  return augmentedLeadMetadata;
};

const fetchLeadMetadataForOpportunity = async (
  tabId: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  const leadType: string | undefined = (await getLDTypeConfigFromRawData(tabId))?.[0]
    ?.LeadTypeInternalName;

  const leadMetadata = await fetchMetaData(CallerSource.SmartViews, leadType);
  const representationName = await fetchRepresentationName(CallerSource.SmartViews, leadType);
  const leadSingularRepName = representationName?.SingularName || 'Lead';

  if (!Object?.values(leadMetadata)?.length) {
    return {
      metaDataMap: {},
      representationName: DEFAULT_ENTITY_REP_NAMES.lead
    };
  }

  const augmentedLeadMetadata = getAugmentedLeadMetadata(leadMetadata, leadSingularRepName);
  return {
    metaDataMap: {
      ...augmentedLeadMetadata,
      ...customMetaDataForLead(leadSingularRepName)
    },
    representationName: representationName || DEFAULT_ENTITY_REP_NAMES.lead
  };
};

export { fetchLeadMetadataForOpportunity };
