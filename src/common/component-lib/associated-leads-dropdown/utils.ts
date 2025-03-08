import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  IFetchOptions,
  IFetchOptionsResponse,
  IGetAugmentedLeadsArray,
  ILead,
  IResponseOption
} from './associated-lead-dropdown.types';
import { API_ROUTES } from 'common/constants';
import HandleLeadOptions from './HandleLeadOptions';

export const containsLead = (
  lead: IGetAugmentedLeadsArray,
  leadsArray: Record<string, string>[]
): boolean => {
  try {
    let isPresent = false;

    leadsArray?.forEach((elem) => {
      if (elem?.ProspectID === lead?.ProspectID) {
        isPresent = true;
      }
    });
    return isPresent;
  } catch (error) {
    trackError(error);
    return false;
  }
};

const filterSelectedLeads = (
  response: IGetAugmentedLeadsArray[],
  selectedOptions: Record<string, string>[]
): IGetAugmentedLeadsArray[] => {
  try {
    const filteredLeadsArray =
      selectedOptions && response?.filter((lead) => !containsLead(lead, selectedOptions));
    return filteredLeadsArray;
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getAugmentedLeadsArray = (leadsArray: ILead[]): IGetAugmentedLeadsArray[] => {
  const augmentedArray: IGetAugmentedLeadsArray[] = [];
  try {
    leadsArray?.forEach((leadArray) => {
      let tempLeadArray = {};
      leadArray.LeadPropertyList?.forEach((lead) => {
        const key = lead?.Attribute;
        const value = lead?.Value;
        tempLeadArray = { ...tempLeadArray, [key]: value };
      });
      augmentedArray?.push(tempLeadArray);
    });
    return augmentedArray;
  } catch (error) {
    trackError(error);
    return [];
  }
};

const getAugumentedLeadsArrayOnRemovedLeads = (
  leadsArray: IGetAugmentedLeadsArray[],
  removedLeadIds?: string[]
): IGetAugmentedLeadsArray[] => {
  if (!leadsArray || !removedLeadIds || removedLeadIds.length == 0) return leadsArray;

  const removedLeadsArray: IGetAugmentedLeadsArray[] = [];
  removedLeadIds.forEach((id) => {
    leadsArray = leadsArray.filter((lead) => {
      if (lead.ProspectID == id) {
        removedLeadsArray.push(lead);
        return false;
      }
      return true;
    });
  });
  return [...removedLeadsArray, ...leadsArray];
};

const fetchOptions = async (props: IFetchOptions): Promise<IResponseOption[]> => {
  const { entityId, selectedLeadsArray, searchValue, setOptionArrayLength, removedLeadsArray } =
    props;
  try {
    const path = API_ROUTES.smartviews.leadGet;

    const config = `{"GrpConOp":"And","Conditions":[{"Type":"Lead","ConOp":"and","RowCondition":[{"SubConOp":"And","LSO":"RelatedCompanyId","LSO_Type":"String","Operator":"neq","RSO":"${
      entityId || ''
    }"},{},{}]}],"QueryTimeZone":"India Standard Time"}`;

    const body = {
      AdvancedSearch: config,
      Columns: 'LeadIdentifier,EmailAddress,Company,Website,OwnerIdName,ProspectStage',
      CustomFilters: config,
      PageIndex: 1,
      PageSize: '25',
      SearchText: searchValue,
      SortBy: 1,
      SortOn: 'ModifiedOn'
    };

    const response = (await httpPost({
      path,
      module: Module.Marvin,
      body,
      callerSource: CallerSource.AccountAssignLeads
    })) as IFetchOptionsResponse;

    const filteredSelectedOptions = getAugumentedLeadsArrayOnRemovedLeads(
      filterSelectedLeads(getAugmentedLeadsArray(response?.Leads), selectedLeadsArray || []),
      removedLeadsArray
    );

    const option = filteredSelectedOptions?.map((item) => {
      return {
        metaData: { ...item },
        value: item?.ProspectAutoId || '',
        label: item?.ProspectID || '',
        customComponent: HandleLeadOptions(item)
      };
    });
    setOptionArrayLength(option?.length || 0);
    return option;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export { fetchOptions };
