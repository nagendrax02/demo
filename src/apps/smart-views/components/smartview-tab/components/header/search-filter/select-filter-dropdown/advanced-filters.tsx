import { Button } from '@lsq/nextgen-preact/v2/button';
import { classNames } from 'common/utils/helpers/helpers';
import styles from './select-filter-dropdown.module.css';
import { DropdownItem } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { showAdvanceSearchButton } from '../utils';
import { isManageEntityAdvSearchEnabled } from 'apps/smart-views/utils/utils';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { QUICK_FILTER_DEFAULT_OPTION } from '../quick-filter/constant';
import { Add, Edit } from 'assets/custom-icon/v2';

interface IAdvancedFilters {
  setShowAdvanceSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
  tabId: string;
}

const getAdvancedFilters = (props: IAdvancedFilters): JSX.Element | null => {
  const { setShowAdvanceSearchModal, tabId } = props;
  const quickFilter = getTabData(tabId)?.headerConfig?.secondary?.quickFilterConfig?.quickFilter;

  const isManageEntityAdvSearchApplied = (): boolean => {
    return Boolean(getTabData(tabId)?.gridConfig?.isManageEntityAdvancedSearchApplied);
  };

  const isManageLeadAdvSearchApplied = (): boolean => {
    return Boolean(quickFilter?.Name && quickFilter?.Name !== QUICK_FILTER_DEFAULT_OPTION.Name);
  };

  const buttonText =
    isManageEntityAdvSearchApplied() || isManageLeadAdvSearchApplied()
      ? 'Edit Advanced Filters'
      : 'Advanced Filters';

  const handleClick = (): void => {
    setShowAdvanceSearchModal(true);
  };

  /* 
    TODO: SW-5733 - Ideally showAdvanceSearchButton should be coming from augmentation, but since manage leads doesnt re-augment when
    quick filter is changed, we are doing it this way for now. This ticket depends on SW-5610
  */
  return showAdvanceSearchButton(tabId, quickFilter?.InternalName) ||
    isManageEntityAdvSearchEnabled(tabId) ? (
    <DropdownItem className={classNames('ng_p_2_sb', styles.advanced_filter)}>
      <Button
        onClick={handleClick}
        variant="tertiary"
        size="xs"
        icon={
          isManageEntityAdvSearchApplied() || isManageLeadAdvSearchApplied() ? (
            <Edit type="outline" />
          ) : (
            <Add type="outline" />
          )
        }
        text={
          <span className={classNames('ng_p_1_sb', styles.advanced_filter_text)}>{buttonText}</span>
        }
      />
    </DropdownItem>
  ) : null;
};

export default getAdvancedFilters;
