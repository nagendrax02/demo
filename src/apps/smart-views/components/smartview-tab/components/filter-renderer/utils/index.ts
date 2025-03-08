import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { ConditionEntityType } from 'apps/smart-views/constants/constants';
import { IFetchOptionsRelatedData, IOnFilterChange } from '../../../smartview-tab.types';
import { IGetFilterValue } from '../filter-renderer.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

export type IFilterMethods = {
  fetchOptions: (
    payload: IFetchDropdownPayload,
    fetchOptionsRelatedData: IFetchOptionsRelatedData
  ) => Promise<IOption[]>;
  getFilterValue: (config: IGetFilterValue) => Promise<IOnFilterChange | null>;
};

// eslint-disable-next-line max-lines-per-function, complexity
export const getFilterMethods = async (
  conditionEntityType?: ConditionEntityType
): Promise<IFilterMethods> => {
  switch (conditionEntityType) {
    case ConditionEntityType.CompanyActivity: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./account-activity/fetch-options'),
        import('./account-activity/generate-filter-values')
      ]);

      return {
        fetchOptions: fetchOptions.fetchActivityOptions,
        getFilterValue: getFilterValue.default
      };
    }
    case ConditionEntityType.Activity: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./activity/fetch-options'),
        import('./activity/generate-filter-values')
      ]);

      return {
        fetchOptions: fetchOptions.fetchActivityOptions,
        getFilterValue: getFilterValue.default
      };
    }
    case ConditionEntityType.Account: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./account/fetch-options'),
        import('./account/generate-filter-value')
      ]);

      return {
        fetchOptions: fetchOptions.fetchAccountOptions,
        getFilterValue: getFilterValue.generateAccountFilterValue
      };
    }
    case ConditionEntityType.Opportunity: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./opportunity/fetch-options'),
        import('./opportunity/generate-filter-value')
      ]);

      return {
        fetchOptions: fetchOptions.fetchOpportunityOptions,
        getFilterValue: getFilterValue.default
      };
    }
    case ConditionEntityType.Task: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./task/fetch-options'),
        import('./task/generate-filter-value')
      ]);

      return {
        fetchOptions: fetchOptions.fetchTaskOptions,
        getFilterValue: getFilterValue.generateTaskFilterValue
      };
    }
    case ConditionEntityType.Lists: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./lists/fetch-options'),
        import('./lists/generate-filter-value')
      ]);
      return {
        fetchOptions: fetchOptions.fetchListsOptions,
        getFilterValue: getFilterValue.default
      };
    }
    case ConditionEntityType.Lead:
    default: {
      const [fetchOptions, getFilterValue] = await Promise.all([
        import('./lead/fetch-options'),
        import('./lead/generate-filter-value')
      ]);

      return {
        fetchOptions: fetchOptions.fetchLeadOptions,
        getFilterValue: getFilterValue.default
      };
    }
  }
};
