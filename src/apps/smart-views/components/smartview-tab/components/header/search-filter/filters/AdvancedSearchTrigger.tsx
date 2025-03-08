import { classNames } from 'common/utils/helpers/helpers';
import styles from '../../../filter-renderer/components/trigger/trigger.module.css';
import {
  getTabData,
  resetManageEntityAdvSearch,
  setFetchCriteriaAndRouteForManageLead,
  useQuickFilter
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import {
  QUICK_FILTER_DEFAULT_OPTION,
  SEARCH_RESULTS,
  STARRED_LEAD
} from '../quick-filter/constant';
import { isQuickFilterEnabled } from '../utils';
import { isManageEntityAdvSearchEnabled } from 'apps/smart-views/utils/utils';
import searchFilterStyles from '../search-filter.module.css';
import Chip from 'apps/smart-views/components/smartview-tab/components/chip';
import { API_ROUTES } from 'common/constants';

interface IAdvancedSearchTrigger {
  tabId: string;
  setShowAdvanceSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdvancedSearchTrigger = (props: IAdvancedSearchTrigger): JSX.Element | null => {
  const { tabId, setShowAdvanceSearchModal } = props;
  const quickFilter = useQuickFilter(tabId);

  const isManageEntityAdvSearchApplied = (): boolean => {
    return Boolean(getTabData(tabId)?.gridConfig?.isManageEntityAdvancedSearchApplied);
  };

  const isManageLeadAdvSearchApplied = (): boolean => {
    return Boolean(quickFilter && quickFilter.ID !== QUICK_FILTER_DEFAULT_OPTION.ID);
  };

  const isSearchResultsApplied = (): boolean => {
    return Boolean(quickFilter && quickFilter.ID === SEARCH_RESULTS.ID);
  };

  const isStarredLeads = (): boolean => {
    return Boolean(quickFilter && quickFilter.InternalName === STARRED_LEAD);
  };

  const handleClick = (): void => {
    setShowAdvanceSearchModal(true);
  };

  const handleCloseIconClick = (): void => {
    if (isQuickFilterEnabled(tabId)) {
      setFetchCriteriaAndRouteForManageLead({
        tabId: tabId,
        isStarredList: false,
        listId: QUICK_FILTER_DEFAULT_OPTION.ID,
        route: API_ROUTES.smartviews.leadGet,
        advancedSearch: QUICK_FILTER_DEFAULT_OPTION.Definition,
        quickFilter: QUICK_FILTER_DEFAULT_OPTION
      });
    } else if (isManageEntityAdvSearchEnabled(tabId)) {
      resetManageEntityAdvSearch();
    }
  };

  return isManageLeadAdvSearchApplied() || isManageEntityAdvSearchApplied() ? (
    <Chip
      className={classNames(
        styles.trigger_inactive,
        !isSearchResultsApplied() ? searchFilterStyles.trigger_quick_filter : '',
        isStarredLeads() ? searchFilterStyles.trigger_quick_filter_disabled : '',
        !isSearchResultsApplied() ? searchFilterStyles.trigger_quick_filter_applied : ''
      )}
      label="Advanced Search"
      subLabel="Added"
      onCrossClick={handleCloseIconClick}
      onButtonClick={handleClick}
    />
  ) : null;
};

export default AdvancedSearchTrigger;
