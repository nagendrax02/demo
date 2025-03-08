import { classNames } from 'common/utils/helpers/helpers';
import styles from './select-filter-dropdown.module.css';
import { Button } from '@lsq/nextgen-preact/v2/button';
import Settings from 'assets/custom-icon/Settings';
import { DropdownItem } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { showConfigureFields } from '../utils';
import { getTabData } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';

const getConfigureFields = ({
  tabId,
  setShowManageFiltersModal
}: {
  tabId: string;
  setShowManageFiltersModal: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element | null => {
  const quickFilter = getTabData(tabId)?.headerConfig?.secondary?.quickFilterConfig?.quickFilter;

  const handleClick = (): void => {
    setShowManageFiltersModal(true);
  };

  /* 
    TODO: SW-5733 - Ideally showConfigureFields should be coming from augmentation, but since manage leads doesnt re-augment when
    quick filter is changed, we are doing it this way for now. This ticket depends on SW-5610
  */
  return showConfigureFields(tabId, quickFilter?.InternalName) ? (
    <DropdownItem className={classNames('ng_p_2_sb', styles.configure_fields)}>
      <Button
        onClick={handleClick}
        variant="tertiary-gray"
        size="xs"
        customStyleClass={styles.settings_outline}
        icon={<Settings />}
        text={
          <span className={classNames('ng_p_1_sb', styles.configure_fields_text)}>
            Configure Fields
          </span>
        }
      />
    </DropdownItem>
  ) : null;
};

export default getConfigureFields;
