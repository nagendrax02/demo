import {
  DropdownRoot,
  DropdownTrigger,
  DropdownPortal,
  DropdownContent,
  DropdownSeparator
} from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { useState } from 'react';
import { IHeaderFilterConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import styles from './select-filter-dropdown.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import Icon from '@lsq/nextgen-preact/icon';
import getConfigureFields from './configure-fields';
import getFilterOptions from './filter-options';
import getAdvancedFilters from './advanced-filters';

interface ISelectFilterDropdown {
  filterConfig: IHeaderFilterConfig;
  tabId: string;
  setShowAdvanceSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowManageFiltersModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectFilterDropdown = (props: ISelectFilterDropdown): JSX.Element => {
  const { filterConfig, tabId, setShowAdvanceSearchModal, setShowManageFiltersModal } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const componentsToRender = [
    getFilterOptions({ tabId, filterConfig, search, setSearch }),
    getAdvancedFilters({ tabId, setShowAdvanceSearchModal }),
    getConfigureFields({ tabId, setShowManageFiltersModal })
  ].filter(Boolean);

  return (
    <DropdownRoot onOpenChange={setOpen} open={open}>
      <DropdownTrigger onClick={() => {}}>
        <div
          className={classNames(
            styles.filter_button,
            'ng_p_1_sb',
            open ? styles.filter_button_active : ''
          )}>
          <Icon name="add" />
          Filter
        </div>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent className={styles.dropdown_content}>
          {componentsToRender.map((component, index) => {
            return (
              <>
                {component}
                {component && index < componentsToRender.length - 1 ? <DropdownSeparator /> : null}
              </>
            );
          })}
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>
  );
};

export default SelectFilterDropdown;
