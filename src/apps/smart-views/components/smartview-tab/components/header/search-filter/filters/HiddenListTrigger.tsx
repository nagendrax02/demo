import { classNames } from 'common/utils/helpers/helpers';
import styles from 'apps/smart-views/components/smartview-tab/components/filter-renderer/components/trigger/trigger.module.css';
import searchFilterStyles from '../search-filter.module.css';
import Chip from 'apps/smart-views/components/smartview-tab/components/chip';
import { resetShowHiddenFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

interface IHiddenListTrigger {
  tabId: string;
  isHiddenListApplied?: boolean;
}

const HiddenListTrigger = (props: IHiddenListTrigger): JSX.Element | null => {
  const { tabId, isHiddenListApplied } = props;

  const handleCloseIconClick = (): void => {
    resetShowHiddenFilter(tabId);
  };

  return isHiddenListApplied ? (
    <Chip
      className={classNames(
        styles.trigger_inactive,
        searchFilterStyles.trigger_quick_filter,
        searchFilterStyles.trigger_quick_filter_applied
      )}
      label="Show"
      subLabel="Hidden Lists"
      onCrossClick={handleCloseIconClick}
      onButtonClick={() => {}}
    />
  ) : null;
};

export default HiddenListTrigger;
