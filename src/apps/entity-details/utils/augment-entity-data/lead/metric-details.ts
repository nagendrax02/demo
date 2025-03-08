import { ILead, ILeadDetails } from 'common/types';
import { IAugmentedMetaDataProvider } from 'common/types/entity/lead/metadata.types';
import { DISENGAGED, ENGAGED, LEAD_METRICS, LEAD_QUALITY } from '../../../constants';
import { IMetricsConfig } from 'apps/entity-details/types';
import { getAugmentedMetaData } from './meta-data';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';

interface IGetMetricName {
  leadDetail: ILeadDetails;
  leadAugmentedMetaData: IAugmentedMetaDataProvider;
  schemaName: string;
  displayName: string;
}

// eslint-disable-next-line complexity
const getMetricName = (props: IGetMetricName): string => {
  const { leadDetail, leadAugmentedMetaData, schemaName, displayName } = props;
  switch (schemaName) {
    case LEAD_SCHEMA_NAME.LEAD_QUALITY:
      return leadAugmentedMetaData?.[schemaName]?.DisplayName || displayName || LEAD_QUALITY;
    case LEAD_SCHEMA_NAME.LEAD_ENGAGEMENT_SCORE: {
      const value = leadDetail?.Fields[LEAD_SCHEMA_NAME.LEAD_ENGAGEMENT_SCORE];
      return value === '0' || value === null ? DISENGAGED : ENGAGED;
    }
    default:
      return leadAugmentedMetaData?.[schemaName]?.DisplayName || '';
  }
};

const getMetricValue = (data: ILeadDetails, schemaName: string): string | number => {
  if (schemaName === LEAD_SCHEMA_NAME.LEAD_QUALITY) {
    const qualityScoreValue = data?.Fields[LEAD_SCHEMA_NAME.LEAD_QUALITY];

    if (qualityScoreValue !== null) {
      const qualityScore = Math.round(Number(qualityScoreValue));
      return `${qualityScore > 10 ? 10 : qualityScore}/10`;
    }
  }
  return (data?.Fields[schemaName] as string | number) === null
    ? ''
    : (data?.Fields[schemaName] as string | number);
};

const getAugmentedMetricDetails = (entityData: ILead): IMetricsConfig[] => {
  const augmentedMetaData = getAugmentedMetaData(entityData?.metaData?.Fields);

  if (!augmentedMetaData?.FirstName) {
    return [];
  }

  const metricsInfo = entityData?.details?.VCardConfiguration?.Sections?.find(
    (section) => section.Name === LEAD_METRICS
  );

  return (
    metricsInfo?.Fields?.filter((field) => augmentedMetaData[field?.SchemaName])?.map((field) => ({
      id: field?.SchemaName,
      name: getMetricName({
        leadDetail: entityData?.details,
        leadAugmentedMetaData: augmentedMetaData,
        schemaName: field?.SchemaName,
        displayName: field?.DisplayName
      }),
      value: getMetricValue(entityData?.details, field?.SchemaName)
    })) || []
  );
};

export { getAugmentedMetricDetails };
