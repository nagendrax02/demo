import { fetchData } from './fetch-data';
import { EntityType } from 'common/types';
import { getAugmentedAHDetails } from './utils';
import { IAugmentedAHDetail } from '../types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter/date-filter.types';
import { DEFAULT_PAGE_SIZE } from '../constants';
import { IEntityIds } from '../../entity-details/types/entity-store.types';
import { getAugmentedResponse } from '../augment-response';
import { ISelectedLeadFilterOption } from '../components/filters/account-lead-filter/accountLeadFilter.types';

interface IFetchNextPageData {
  type: EntityType;
  typeFilter: IOption[];
  dateFilter: IDateOption | undefined;
  augmentedAHDetails: IAugmentedAHDetail[] | null;
  setAugmentedAHDetails: (data: IAugmentedAHDetail[]) => void;
  entityIds: IEntityIds;
  pageIndex?: number;
  eventCode?: number;
  accountLeadSelectedOption?: ISelectedLeadFilterOption[];
}

export const fetchNextPageData = async ({
  type,
  typeFilter,
  dateFilter,
  augmentedAHDetails,
  setAugmentedAHDetails,
  pageIndex,
  entityIds,
  eventCode,
  accountLeadSelectedOption
}: IFetchNextPageData): Promise<number> => {
  let response = await fetchData({
    type,
    typeFilter,
    dateFilter,
    pageIndex,
    entityIds,
    eventCode: eventCode ? `${eventCode}` : undefined,
    accountLeadSelectedOption: accountLeadSelectedOption
  });

  response = getAugmentedResponse(response);

  if (response && augmentedAHDetails) {
    const newAugmentedAHDetails = (await getAugmentedAHDetails(
      response,
      type
    )) as IAugmentedAHDetail[];
    setAugmentedAHDetails(augmentedAHDetails.concat(newAugmentedAHDetails));
  }
  return response?.length || DEFAULT_PAGE_SIZE;
};
