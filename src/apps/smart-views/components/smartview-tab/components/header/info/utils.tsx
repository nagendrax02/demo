import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from 'common/utils/helpers';
import { TabType } from 'apps/smart-views/constants/constants';
import { activityMetadataGet } from 'common/utils/entity-data-manager/activity/activity';
import { CallerSource } from 'common/utils/rest-client';
import { EventCode } from 'common/component-lib/activity-table/activity-table.types';
import { fetchAccountMetaData } from 'common/utils/entity-data-manager/account/metadata';
import { IActivityMetaData } from 'common/utils/entity-data-manager/activity/activity.types';
import { fetchMetaData as fetchOppMetaData } from 'common/utils/entity-data-manager/opportunity/metadata';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

interface IParsedAdvSearch {
  ConditionOperator: string;
  Conditions: string[];
}

export const getParsedAdvSearchElement = (
  advSearchEnglish: string,
  advancedSearchType: string
): string => {
  const parsedAdvSearch = safeParseJson(advSearchEnglish) as IParsedAdvSearch;
  const conditionOperator = parsedAdvSearch?.ConditionOperator;
  let element = '';

  //advancedSearchType will be something like "activity is sales activity", with which we can create a tab. it can be separately tab definition, without adding advanced search condition
  //and it will not be part of "parsedAdvSearch", so we are handling it separately.

  if (advancedSearchType) {
    element += `<div class='main-condition'>${advancedSearchType}</div>`;
  }

  parsedAdvSearch?.Conditions?.forEach((curr, index) => {
    if (index === 0 && element) {
      // if we have element already, meaning we have advancedSearchType, so we will add "And" as operator
      element += `<div><span class='condition-operator'>And</span>`;
    } else if (index !== 0) {
      // here we have "index !== 0" check because, if we don't have advancedSearchType, so we will add operator only after adding advanced search condition
      element += `<div><span class='condition-operator'>${conditionOperator}</span>`;
    }
    element += `<div class='condition-wrapper'>${curr}</div></div>`;
  });

  return element;
};

const getEnglishText: Record<number, string> = {
  [TabType.Activity]: 'Activity Type is',
  [TabType.Account]: 'Account Type is',
  [TabType.Opportunity]: 'Opportunity Type is'
};

const getActivityEntityTypeName = (entityCode: string, metaData: IActivityMetaData): string => {
  return entityCode === `${EventCode.CancelledSalesActivity}`
    ? `${metaData.DisplayName} - Cancelled`
    : metaData.DisplayName || '';
};

// eslint-disable-next-line complexity
export const getAdvancedSearchType = async (
  tabType: TabType,
  entityCode: string
): Promise<string> => {
  try {
    const englishText = getEnglishText[tabType];
    let entityTypeName = '';

    // TODO: Add more cases for account and opportunity later
    switch (tabType) {
      case TabType.Activity: {
        const metaData = await activityMetadataGet(parseInt(entityCode), CallerSource.SmartViews);
        entityTypeName = getActivityEntityTypeName(entityCode, metaData);
        break;
      }
      case TabType.Opportunity: {
        const metaData = await fetchOppMetaData(CallerSource.SmartViews, entityCode);
        entityTypeName = metaData?.DisplayName ?? '';
        break;
      }
      case TabType.Account: {
        const { representationName } = await fetchAccountMetaData(
          entityCode,
          CallerSource.SmartViews
        );
        entityTypeName = representationName?.SingularName || '';
        break;
      }
    }

    if (entityTypeName && englishText) {
      return `${englishText} <b>${entityTypeName}</b>`;
    }
  } catch (err) {
    trackError(err);
  }
  return '';
};

export const getLeadTypeName = (
  leadTypeConfiguration?: ILeadTypeConfiguration[]
): string | undefined => {
  return leadTypeConfiguration?.map((config) => config?.LeadTypeName)?.join(', ') || undefined;
};
