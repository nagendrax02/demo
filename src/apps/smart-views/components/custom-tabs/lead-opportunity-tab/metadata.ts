import { trackError } from 'common/utils/experience/utils/track-error';
import { IAugmentedSmartViewEntityMetadata } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { ConditionEntityType } from 'apps/smart-views/constants/constants';
import { DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { fetchSmartViewOppMetadata } from 'apps/smart-views/augment-tab-data/opportunity/meta-data/opportunity-metadata';
import { CallerSource } from 'common/utils/rest-client';
import { ANY_OPPORTUNITY } from './constants';
import { getOpportunityRepName } from 'apps/smart-views/utils/utils';

// eslint-disable-next-line max-lines-per-function
export const getDefaultOppMetadata = (): Record<string, IAugmentedSmartViewEntityMetadata> => {
  return {
    Status: {
      schemaName: 'Status',
      displayName: 'Status',
      renderType: RenderType.OppStatusHighlighted,
      dataType: DataType.SearchableDropdown,
      conditionEntityType: ConditionEntityType.Opportunity
    },
    Owner: {
      schemaName: 'Owner',
      displayName: 'Owner',
      renderType: RenderType.String,
      dataType: DataType.ActiveUsers,
      conditionEntityType: ConditionEntityType.Opportunity
    },
    ['mx_Custom_2']: {
      schemaName: 'mx_Custom_2',
      displayName: 'Stage',
      renderType: RenderType.String,
      dataType: DataType.SearchableDropdown,
      conditionEntityType: ConditionEntityType.Opportunity
    },
    ['mx_Custom_1']: {
      schemaName: 'mx_Custom_1',
      displayName: 'Opportunity Name',
      renderType: RenderType.String,
      dataType: DataType.String,
      conditionEntityType: ConditionEntityType.Opportunity
    },
    ['mx_Custom_6']: {
      schemaName: 'mx_Custom_6',
      displayName: 'Expected Deal Size',
      renderType: RenderType.String,
      dataType: DataType.Number,
      conditionEntityType: ConditionEntityType.Opportunity
    },
    ['mx_Custom_8']: {
      schemaName: 'mx_Custom_8',
      displayName: 'Expected Closure Date',
      renderType: RenderType.Datetime,
      dataType: DataType.DateTime,
      conditionEntityType: ConditionEntityType.Opportunity
    }
  };
};

export const getLeadOppTabMetadata = async (
  entityCode: string
): Promise<{
  metaDataMap: Record<string, IAugmentedSmartViewEntityMetadata>;
  representationName: IEntityRepresentationName;
}> => {
  try {
    if (entityCode === ANY_OPPORTUNITY) {
      const representationName = await getOpportunityRepName();
      return {
        metaDataMap: getDefaultOppMetadata(),
        representationName: representationName || DEFAULT_ENTITY_REP_NAMES.opportunity
      };
    }
    return await fetchSmartViewOppMetadata(entityCode, CallerSource.LeadDetails);
  } catch (error) {
    trackError(error);
    return { metaDataMap: {}, representationName: DEFAULT_ENTITY_REP_NAMES.opportunity };
  }
};
