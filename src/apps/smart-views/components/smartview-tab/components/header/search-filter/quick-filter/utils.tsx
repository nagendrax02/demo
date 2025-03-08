import {
  IQuickFilterOption,
  IQuickFilterResponse,
  IStarredLeadFilters
} from './quick-filter.types';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import CustomOption from './CustomOption';
import { QUICK_FILTER_DEFAULT_OPTION, SEARCH_RESULTS, STARRED_LEAD } from './constant';
import { setFetchCriteriaAndRouteForManageLead } from '../../../../smartview-tab.store';
import { getUnRestrictedFields } from 'apps/smart-views/augment-tab-data/lead/helpers';
import { getLDTypeConfigFromRawData } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { STARRED_LEADS_FILTERS } from 'src/apps/smart-views/components/custom-tabs/manage-lead-tab/constants';
import Flash from 'assets/custom-icon/v2/Flash';
import styles from './quick-filter.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import { ArrowDown } from 'assets/custom-icon/v2';

const getAugmentedQuickFilters = ({
  response,
  handleDelete,
  handleEdit
}: {
  response: IQuickFilterResponse[];
  handleDelete: (item: IQuickFilterResponse) => void;
  handleEdit: (item: IQuickFilterResponse) => void;
}): IQuickFilterOption[] => {
  const menuItems: IQuickFilterOption[] = [];

  if (response) {
    response.forEach((item) => {
      menuItems.push({
        label: item.Name,
        value: item.Definition,
        ...item,
        customComponent: (
          <CustomOption option={item} handleDelete={handleDelete} handleEdit={handleEdit} />
        )
      });
    });
  }

  return menuItems;
};

const fetchQuickFilters = async ({
  handleDelete,
  handleEdit,
  activeTab
}: {
  handleDelete: (item: IQuickFilterResponse) => void;
  handleEdit: (item: IQuickFilterResponse) => void;
  activeTab: string;
}): Promise<IQuickFilterOption[]> => {
  try {
    let url = API_ROUTES.smartviews.QuickFilter;

    const leadType: string | undefined = (await getLDTypeConfigFromRawData(activeTab))?.[0]
      ?.LeadTypeInternalName;

    if (leadType) {
      url += `?leadType=${leadType}`;
    }

    const response = await httpGet<IQuickFilterResponse[]>({
      callerSource: CallerSource.ManageLeads,
      module: Module.Marvin,
      path: url
    });

    return getAugmentedQuickFilters({
      response,
      handleDelete,
      handleEdit
    });
  } catch (error) {
    console.log(error);
  }

  return [];
};

const recordDeleteApiCall = async ({
  itemSelected
}: {
  itemSelected: IQuickFilterResponse | undefined;
}): Promise<void> => {
  const path = `${API_ROUTES.smartviews.QuickFilterDelete}${itemSelected?.ID}`;
  await httpGet({
    callerSource: CallerSource.ManageLeads,
    module: Module.Marvin,
    path: path
  });
};

const getStarredLeadFilters = async (): Promise<IFilter> => {
  const starredLeadFilters: IStarredLeadFilters = STARRED_LEADS_FILTERS;
  const starredLeadUnrestrictedFilters = await getUnRestrictedFields(
    starredLeadFilters.selectedFilters
  );

  // Filter starredLeadFilters.selectedFilters
  const filteredSelectedFilters = starredLeadFilters?.selectedFilters?.filter(
    (filter) => starredLeadUnrestrictedFilters?.includes(filter)
  );

  // Filter starredLeadFilters.bySchemaName
  const filteredBySchemaName = Object.keys(starredLeadFilters?.bySchemaName || {})?.reduce(
    (obj, key) => {
      if (starredLeadUnrestrictedFilters?.includes(key)) {
        obj[key] = starredLeadFilters?.bySchemaName[key];
      }
      return obj;
    },
    {}
  );

  return {
    selectedFilters: filteredSelectedFilters,
    bySchemaName: filteredBySchemaName
  };
};

const getValidQuickFilter = (
  selectedQuickFilter: IQuickFilterResponse | undefined
): IQuickFilterResponse => {
  if (!selectedQuickFilter || selectedQuickFilter.ID === SEARCH_RESULTS.ID) {
    return QUICK_FILTER_DEFAULT_OPTION;
  }

  return selectedQuickFilter;
};

const convertToQuickFilterOption = (quickFilter: IQuickFilterResponse): IQuickFilterOption => {
  return {
    label: quickFilter.Name === QUICK_FILTER_DEFAULT_OPTION.Name ? 'My Filters' : quickFilter.Name,
    value: quickFilter.Definition,
    ...quickFilter
  };
};

const convertToQuickFilterResponse = (
  selectedQuickFilter: IQuickFilterOption
): IQuickFilterResponse => {
  const { label, value, ...rest } = selectedQuickFilter;
  return rest;
};

const menuItemSelectionHandler = async ({
  selectedQuickFilter,
  activeTab
}: {
  selectedQuickFilter: IQuickFilterOption;
  activeTab: string;
}): Promise<void> => {
  if (selectedQuickFilter?.InternalName === STARRED_LEAD) {
    setFetchCriteriaAndRouteForManageLead({
      tabId: activeTab,
      isStarredList: true,
      listId: selectedQuickFilter?.ID,
      route: API_ROUTES.smartviews.starredLeadsGet,
      advancedSearch: selectedQuickFilter?.Definition,
      quickFilter: convertToQuickFilterResponse(selectedQuickFilter),
      starredLeadFilters: await getStarredLeadFilters()
    });
  } else {
    setFetchCriteriaAndRouteForManageLead({
      tabId: activeTab,
      isStarredList: false,
      listId: selectedQuickFilter?.ID,
      route: API_ROUTES.smartviews.leadGet,
      advancedSearch: selectedQuickFilter?.Definition,
      quickFilter: convertToQuickFilterResponse(selectedQuickFilter)
    });
  }
};

const isQuickFilterSelected = (selectedQuickFilter: IQuickFilterOption): boolean => {
  return selectedQuickFilter.Name !== QUICK_FILTER_DEFAULT_OPTION.Name;
};

const getStyles = (selectedOption: IQuickFilterOption, open: boolean): string => {
  return classNames(
    styles.button_container,
    'ng_p_1_sb',
    open ? styles.button_active : styles.button_inactive,
    isQuickFilterSelected(selectedOption) ? styles.button_selected : ''
  );
};

const getTriggerLeftIcon = (selectedOption: IQuickFilterOption): JSX.Element | undefined => {
  return !isQuickFilterSelected(selectedOption) ? (
    <Flash type="outline" className={styles.icon} />
  ) : undefined;
};

const getTriggerRightIcon = (open: boolean): JSX.Element => {
  return (
    <ArrowDown type="outline" className={classNames(styles.icon, open ? styles.arrow_up : '')} />
  );
};

export {
  recordDeleteApiCall,
  menuItemSelectionHandler,
  convertToQuickFilterResponse,
  convertToQuickFilterOption,
  fetchQuickFilters,
  isQuickFilterSelected,
  getStyles,
  getTriggerLeftIcon,
  getTriggerRightIcon,
  getValidQuickFilter
};
