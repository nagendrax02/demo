import styles from './module-items.module.css';
import { INavigationReferenceMap } from '../../../app-header.types';
import Item from './Item';
import { getSegregatedItems } from './utils';
import MoreItems from './MoreItems';
import { isChildNavItemSelected } from '../utils';

interface IModuleItemsProps {
  selectedModuleId: string;
  selectedModuleItemId: string;
  handleModuleItemClick: (id: string) => void;
  navigationReferenceMap: INavigationReferenceMap;
}

/**
 * Displays a list of navigation items within the selected module.
 */

const ModuleItems = ({
  selectedModuleId,
  selectedModuleItemId,
  handleModuleItemClick,
  navigationReferenceMap
}: IModuleItemsProps): JSX.Element => {
  const selectedModuleItems = navigationReferenceMap?.[selectedModuleId]?.data?.SubMenu;
  const { visibleItems, moreItems } = getSegregatedItems(selectedModuleItems ?? []);

  return (
    <div className={styles.container}>
      {visibleItems?.map((visibleItem) => {
        return (
          <Item
            key={visibleItem?.Id}
            item={visibleItem}
            isActive={
              selectedModuleItemId === visibleItem?.Id ||
              isChildNavItemSelected(selectedModuleItemId, visibleItem?.SubMenu)
            }
            handleModuleItemClick={handleModuleItemClick}
            selectedModuleItemId={selectedModuleItemId}
            navigationReferenceMap={navigationReferenceMap}
          />
        );
      })}
      {moreItems?.length ? (
        <MoreItems
          moreItems={moreItems}
          handleModuleItemClick={handleModuleItemClick}
          selectedModuleItemId={selectedModuleItemId}
          navigationReferenceMap={navigationReferenceMap}
        />
      ) : null}
    </div>
  );
};

export default ModuleItems;
