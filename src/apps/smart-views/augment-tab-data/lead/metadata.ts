import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource } from 'common/utils/rest-client';
import { ILeadMetadataMap } from 'common/types';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import {
  fetchMetaData,
  fetchRepresentationName
} from 'common/utils/entity-data-manager/lead/metadata';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { customFormedMetadata } from './helpers';
import { DISPLAY_NAME, GROUPS, SCHEMA_NAMES } from '../../constants/constants';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';
import { getIsAccountEnabled } from 'common/utils/helpers/settings-enabled';
import { getLDTypeConfigFromRawData } from '../common-utilities/utils';

const getCustomObjectMetaData = (
  currentMetadata: ILeadAttribute,
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
        parentSchemaName: currentMetadata?.SchemaName,
        dataType: cfsMetaData?.DataType,
        parentField: cfsMetaData?.ParentField
      };
    });
  }
};

const getAugmentedRenderType = (currentMetadata: ILeadAttribute): RenderType => {
  if (currentMetadata?.SchemaName === 'TimeZone') return RenderType.TimeZone;
  return currentMetadata.RenderType;
};

const getMetaData = (currentMetadata: ILeadAttribute): IAugmentedSmartViewEntityMetadata => {
  return {
    schemaName: currentMetadata?.SchemaName,
    displayName: currentMetadata?.DisplayName,
    renderType: getAugmentedRenderType(currentMetadata),
    dataType: currentMetadata?.DataType,
    parentField: currentMetadata?.ParentField,
    isSortable: currentMetadata?.IsSortable
  };
};

const getAugmentedSmartViewsLeadMetadata = (
  leadMetadata: ILeadMetadataMap
): Record<string, IAugmentedSmartViewEntityMetadata> => {
  if (!leadMetadata) {
    return {};
  }

  const augmentedLeadMetadata = Object.values(leadMetadata)?.reduce(
    (
      allMetadata: Record<string, IAugmentedSmartViewEntityMetadata>,
      currentMetadata: ILeadAttribute
    ) => {
      if (currentMetadata?.DataType === DataType.CustomObject) {
        getCustomObjectMetaData(currentMetadata, allMetadata);
      } else if (currentMetadata?.SchemaName === GROUPS) {
        allMetadata[SCHEMA_NAMES.GROUP] = {
          ...getMetaData(currentMetadata),
          schemaName: SCHEMA_NAMES.GROUP,
          displayName: DISPLAY_NAME.SALES_GROUP
        };
      } else {
        allMetadata[currentMetadata?.SchemaName] = getMetaData(currentMetadata);
      }

      return allMetadata;
    },
    {}
  );
  return augmentedLeadMetadata;
};

const filteredLeadMetadata = ({
  leadMetadata,
  isAccountEnabled
}: {
  leadMetadata: Record<string, IAugmentedSmartViewEntityMetadata>;
  isAccountEnabled: boolean;
}): Record<string, IAugmentedSmartViewEntityMetadata> => {
  const relatedCompanyId = leadMetadata?.P_RelatedCompanyId || leadMetadata?.RelatedCompanyId;
  if (!isAccountEnabled || !relatedCompanyId) {
    const { CompanyTypeName, RelatedCompanyId, ...otherLeadMetadata } = leadMetadata;
    return otherLeadMetadata;
  }
  return leadMetadata;
};

const fetchSmartViewLeadMetadata = async (
  callerSource: CallerSource,
  tabId: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName | undefined;
}> => {
  try {
    const leadType: string | undefined = (await getLDTypeConfigFromRawData(tabId))?.[0]
      ?.LeadTypeInternalName;

    const [isAccountEnabled, metaDataMap] = await Promise.all([
      getIsAccountEnabled(callerSource),
      fetchMetaData(callerSource, leadType)
    ]);
    const representationName = await fetchRepresentationName(callerSource, leadType);

    // disable sorting in case of Notes SchemaName
    if (metaDataMap.Notes) {
      metaDataMap.Notes = { ...metaDataMap.Notes, IsSortable: false };
    }
    const augmentedMetadataMap = filteredLeadMetadata({
      leadMetadata: {
        ...getAugmentedSmartViewsLeadMetadata(metaDataMap),
        ...customFormedMetadata(representationName?.SingularName || 'Lead')
      },
      isAccountEnabled
    });

    return {
      metaDataMap: augmentedMetadataMap,
      representationName
    };
  } catch (error) {
    trackError(error);
  }
  return { metaDataMap: {}, representationName: undefined };
};

export { fetchSmartViewLeadMetadata };
