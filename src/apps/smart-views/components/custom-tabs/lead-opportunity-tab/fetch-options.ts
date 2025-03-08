import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { fetchCategoryMetadata } from 'apps/activity-history/utils';
import { IFetchDropdownPayload } from 'common/utils/entity-data-manager/entity-data-manager.types';
import { DEFAULT_OPP_TYPE_OPTION } from './constants';
import { getOpportunityRepName } from 'apps/smart-views/utils/utils';

const addDefaultOption = async (oppTypeOptions: IOption[]): Promise<void> => {
  const representationName = await getOpportunityRepName();
  const defaultOption = {
    label: DEFAULT_OPP_TYPE_OPTION.label?.replace('Opportunity', representationName?.SingularName),
    value: DEFAULT_OPP_TYPE_OPTION.value
  };
  oppTypeOptions.unshift(defaultOption);
};

export const fetchOppTypeOptions = async (payload?: IFetchDropdownPayload): Promise<IOption[]> => {
  try {
    const { searchText } = payload || {};
    const oppTypeOptions = (await fetchCategoryMetadata()).reduce((acc: IOption[], activity) => {
      if (
        activity.Category === 'Opportunities' &&
        activity.Text?.toLowerCase()?.includes(searchText?.toLowerCase() || '')
      ) {
        acc.push({ label: activity.Text, value: activity.Value });
      }
      return acc;
    }, []);
    await addDefaultOption(oppTypeOptions);

    return oppTypeOptions;
  } catch (error) {
    trackError(error);
    return [];
  }
};

export const fetchDefaultStatusOptions = (payload: IFetchDropdownPayload): IOption[] => {
  const { searchText = '' } = payload;

  return [
    { label: 'Open', value: 'Open' },
    { label: 'Won', value: 'Won' },
    { label: 'Lost', value: 'Lost' }
  ].filter((option) => option.label?.toLowerCase()?.includes(searchText?.toLowerCase()));
};
