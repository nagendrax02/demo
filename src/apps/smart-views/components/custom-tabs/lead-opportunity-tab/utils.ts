import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from 'common/utils/helpers';
import { commonTabData } from '../constants';
import { ITabResponse } from 'apps/smart-views/smartviews.types';
import {
  ConditionEntityType,
  ConditionOperator,
  ConditionOperatorType,
  ConditionType,
  TabType
} from 'apps/smart-views/constants/constants';
import {
  IFilter,
  IFilterData,
  IGroupCondition,
  IMarvinData,
  ITabConfig
} from '../../smartview-tab/smartview-tab.types';
import { ILeadOpportunityTabAdvSearch } from './lead-opportunity-tab.types';
import {
  ANY_OPPORTUNITY,
  DEFAULT_COLUMNS,
  DEFAULT_FILTERS,
  DEFAULT_SORT_ON,
  LEAD_OPPORTUNITY_TAB_ID,
  LEAD_OPP_SCHEMA_NAMES
} from './constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { OptionSeperator } from 'apps/smart-views/components/smartview-tab/components/filter-renderer/constants';
import { ICacheConfig, fetchTabData, getDefaultFilters } from '../utils';
import { CallerSource } from 'common/utils/rest-client';
import { workAreaIds } from 'common/utils/process';
import { IWorkAreaConfig } from 'common/utils/process/process.types';

const getEntityCodeFromOppType = (oppTypeOptions: IOption[]): string => {
  const oppTypeValues = oppTypeOptions?.reduce((acc: string[], option) => {
    if (option?.value) {
      acc.push(option.value);
    }
    return acc;
  }, []);
  return oppTypeValues.join(OptionSeperator.MXSeparator);
};

const getRowConditon = (entityCode: string): IGroupCondition => {
  return {
    Type: ConditionEntityType.Activity,
    ConOp: ConditionType.AND,
    RowCondition: [
      {
        SubConOp: ConditionType.AND,
        LSO: 'ActivityEvent',
        ['LSO_Type']: ConditionOperatorType.PAEvent,
        Operator: ConditionOperator.EQUALS,
        RSO: entityCode,
        ['RSO_IsMailMerged']: false
      }
    ]
  };
};

// Write logic for ess tenant later
export const getAdvSearchForLeadOpp = (config: {
  entityCode: string;
  leadId: string;
  isEssEnabled: boolean;
  oppTypeOptions: IOption[];
}): string => {
  try {
    const { entityCode, leadId, isEssEnabled, oppTypeOptions } = config;
    const advanceSearch: ILeadOpportunityTabAdvSearch = {
      GrpConOp: ConditionType.AND,
      Conditions: [
        {
          Type: ConditionEntityType.Activity,
          ConOp: ConditionType.AND,
          RowCondition: [
            {
              SubConOp: ConditionType.AND,
              LSO: 'RelatedProspectId',
              ['LSO_Type']: ConditionOperatorType.String,
              Operator: ConditionOperator.EQUALS,
              RSO: leadId,
              ['RSO_IsMailMerged']: false
            }
          ]
        }
      ]
    };

    if (entityCode !== ANY_OPPORTUNITY) {
      const rowCondition = getRowConditon(entityCode);
      advanceSearch.Conditions?.unshift(rowCondition);
    } else if (isEssEnabled && entityCode === ANY_OPPORTUNITY) {
      const rowCondition = getRowConditon(getEntityCodeFromOppType(oppTypeOptions));
      advanceSearch.Conditions?.unshift(rowCondition);
    }

    return JSON.stringify(advanceSearch);
  } catch (error) {
    trackError('error');
  }
  return '';
};

const createAdditionalData = (
  cachedData: ICacheConfig | undefined,
  details: {
    entityCode: string;
    leadId: string;
    isEssEnabled: boolean;
    oppTypeOptions: IOption[];
  }
): IMarvinData => ({
  Marvin: {
    FilterValues: cachedData?.filters || getDefaultFilters(DEFAULT_FILTERS),
    Exists: true,
    AdvancedSearchText: getAdvSearchForLeadOpp({
      entityCode: details.entityCode,
      leadId: details.leadId,
      isEssEnabled: details.isEssEnabled,
      oppTypeOptions: details.oppTypeOptions
    }),
    ['AdvancedSearchText_English']: '',
    Columns: cachedData?.selectedColumns ?? DEFAULT_COLUMNS,
    SearchText: cachedData?.searchText ?? '',
    SearchSortedOn: cachedData?.sortedOn ?? DEFAULT_SORT_ON,
    tabColumnsWidth: cachedData?.tabWidthConfig,
    RowHeightSelected: cachedData?.rowHeight
  }
});

export const getLeadOpportunityTabData = async ({
  leadId,
  oppTypeFilterValue,
  isEssEnabled,
  oppTypeOptions
}: {
  leadId: string;
  oppTypeFilterValue: string;
  isEssEnabled: boolean;
  oppTypeOptions: IOption[];
}): Promise<ITabResponse> => {
  const cachedTabData = await fetchTabData(LEAD_OPPORTUNITY_TAB_ID, CallerSource.LeadDetails);
  const cachedOppType = cachedTabData?.opportunityType as string;
  const tabData = {
    ...safeParseJson(JSON.stringify(commonTabData)),
    Type: TabType.Opportunity,
    Id: LEAD_OPPORTUNITY_TAB_ID,
    EntityCode: oppTypeFilterValue || cachedOppType || ANY_OPPORTUNITY
  } as ITabResponse;

  const cachedData = cachedTabData?.[tabData.EntityCode] as ICacheConfig;

  const details = {
    entityCode: tabData.EntityCode,
    leadId,
    isEssEnabled,
    oppTypeOptions
  };

  const additionalData = createAdditionalData(cachedData, details);

  tabData.TabContentConfiguration.FetchCriteria = {
    ...tabData.TabContentConfiguration.FetchCriteria,
    PageSize: String(cachedTabData?.[cachedOppType]?.pageSize ?? 25),
    AdditionalData: JSON.stringify(additionalData)
  };

  return tabData;
};

export const getFilterDisableConfig = (
  entityCode: string,
  schemaName: string
): { isDisabled: boolean; isDisabledTooltip: string } => {
  if (entityCode === ANY_OPPORTUNITY && schemaName === LEAD_OPP_SCHEMA_NAMES.STAGE) {
    return {
      isDisabled: true,
      isDisabledTooltip: 'Select an Opportunity Type first to enable Stage selection.'
    };
  }

  return {
    isDisabled: false,
    isDisabledTooltip: ''
  };
};

export const getOppTypeIdArray = (selectedOppId: string, allOppTypes: IOption[]): string[] => {
  const oppTypeIdArray: string[] = [];
  if (selectedOppId && selectedOppId !== ANY_OPPORTUNITY) {
    oppTypeIdArray.push(selectedOppId);
  } else {
    allOppTypes?.forEach((type) => {
      if (type?.value !== ANY_OPPORTUNITY) oppTypeIdArray?.push(type?.value);
    });
  }
  return oppTypeIdArray;
};

export const fetchOppTabProcessData = async (
  workAreas: Record<string, number>,
  selectedOppId: string,
  allOppIds: IOption[]
): Promise<void> => {
  try {
    const oppTypeIdArray = getOppTypeIdArray(selectedOppId, allOppIds);

    const workAreasIds = [...Object.values(workAreas), workAreaIds.NA];
    const workAreaConfig: IWorkAreaConfig[] = [];
    oppTypeIdArray?.forEach((type) => {
      workAreasIds.forEach((workAreaId) => {
        workAreaConfig.push({
          workAreaId,
          additionalData: type
        });
      });
    });

    const fetchData = (await import('common/utils/process/process'))
      .fetchMultipleWorkAreaProcessForms;
    await fetchData(workAreaConfig, CallerSource.SmartViews);
  } catch (err) {
    trackError(err);
  }
};

export const augmentationOnManageFilterSave = (
  filterDataMap: Record<string, IFilterData>,
  tabData: ITabConfig
): IFilter => {
  const currFilters = tabData?.headerConfig?.secondary?.filterConfig?.filters;
  currFilters.bySchemaName = {
    [LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE]:
      currFilters?.bySchemaName?.[LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE],
    ...filterDataMap
  };
  currFilters.selectedFilters = [
    LEAD_OPP_SCHEMA_NAMES.OPPORTUNITY_TYPE,
    ...Object.keys(filterDataMap || {})
  ];

  return currFilters;
};
