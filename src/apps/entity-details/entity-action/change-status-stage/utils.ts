import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { IResponse } from '../change-stage/change-stage.types';
import { API_ROUTES } from 'common/constants';

export const fetchStatusOptions = async (
  eventCode: number,
  searchKeyWord?: string
): Promise<IOption[]> => {
  try {
    const path = API_ROUTES.opportunityDropdownOptionGet;
    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body: {
        SchemaName: 'Status',
        SearchText: searchKeyWord,
        Count: 50,
        Code: eventCode
      },
      callerSource: CallerSource.OpportunityDetailsVCard
    })) as IResponse;
    return (response?.Options as IOption[]) || [];
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const fetchStageOptions = async (eventCode: number): Promise<Record<string, IOption[]>> => {
  try {
    const path = API_ROUTES.opportunityDropdownOptionGet;
    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body: {
        SchemaName: 'mx_Custom_2',
        SearchText: '',
        Count: 50,
        Code: eventCode
      },
      callerSource: CallerSource.OpportunityDetailsVCard
    })) as IResponse;

    const stageOpts: Record<string, IOption[]> = {};

    if (response?.OptionSet) {
      response?.OptionSet?.forEach((opt) => {
        stageOpts[opt?.label] = opt?.options;
      });
    }

    return stageOpts;
  } catch (error) {
    trackError(error);
  }
  return {};
};
