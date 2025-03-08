import styles from './module-items.module.css';
import { classNames } from 'common/utils/helpers';
import { INavigationItem } from '../../../app-header.types';
import Item from './Item';
import Separator from '@lsq/nextgen-preact/v2/separator';
import { BRAND_ICON_MAP } from '../../constants';
import { useCallback } from 'react';
import NoResultsFound from '../NoResultsFound';

interface IModuleItemsProps {
  moduleItems: INavigationItem[];
  selectedModuleItemId: string;
  handleModuleItemClick: (id: string) => void;
}

/**
 * Displays a list of navigation items within the selected module.
 */

const ModuleItems = ({
  moduleItems,
  selectedModuleItemId,
  handleModuleItemClick
}: IModuleItemsProps): JSX.Element => {
  const getItems = useCallback(
    (items: INavigationItem[] = []): JSX.Element[] => {
      return items.map((item, index) => {
        if (item?.IsGroupMenu && item?.SubMenu?.length) {
          return (
            <div key={item.Id} className={styles.group}>
              {index !== 0 ? <Separator length="180px" orientation="horizontal" /> : null}
              <div className={styles.group_header}>
                {BRAND_ICON_MAP?.[item.Id] ? BRAND_ICON_MAP?.[item.Id] : null}
                {!item.IsHiddenFromNavBar ? (
                  <div className={classNames(styles.label, 'ng_p_1_b', 'ng_v2_style')}>
                    {item?.Label}
                  </div>
                ) : null}
              </div>
              {getItems(item?.SubMenu)}
            </div>
          );
        }
        return (
          <Item
            key={item?.Id}
            data={item}
            isActive={selectedModuleItemId === item?.Id}
            handleModuleItemClick={handleModuleItemClick}
          />
        );
      });
    },
    [handleModuleItemClick, selectedModuleItemId]
  );

  if (moduleItems?.length) {
    return (
      <div className={classNames(styles.module_items_container, 'ng_scrollbar')}>
        {getItems(moduleItems)}
      </div>
    );
  }
  return <NoResultsFound />;
};

export default ModuleItems;
