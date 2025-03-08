import SearchBar from './search-bar';
import styles from './nav-menu.module.css';
import Modules from './modules';
import Separator from '@lsq/nextgen-preact/v2/separator';
import ModuleItems, { ModuleOverlayIcon } from './module-items';
import { INavigationItem } from '../../app-header.types';
import useNavMenu from './use-nav-menu';
import { forwardRef } from 'react';
import NoResultsFound from './NoResultsFound';
import { classNames } from 'common/utils/helpers';

interface INavMenuProps {
  data: INavigationItem[];
  selectedModuleId: string;
  selectedModuleItemId: string;
  navMenuPosition: {
    top: number;
    left: number;
  };
  handleModuleItemClick: (id: string) => void;
  handleModuleClick: (id: string) => void;
}

/**
 * Displays all available navigation elements.
 */

const NavMenu = forwardRef<HTMLDivElement, INavMenuProps>(
  (
    {
      selectedModuleId,
      selectedModuleItemId,
      data,
      navMenuPosition,
      handleModuleItemClick,
      handleModuleClick
    },
    ref
  ) => {
    const {
      activeModule,
      modules,
      moduleItems,
      onModuleHover,
      onModuleMouseLeave,
      hoveredModule,
      searchText,
      setSearchText
    } = useNavMenu({
      selectedModuleId,
      data
    });

    return (
      <button
        className={classNames('unstyle_button', styles.outer_container)}
        onMouseLeave={onModuleMouseLeave}>
        <div
          ref={ref}
          className={styles.inner_container}
          style={{ position: 'absolute', top: navMenuPosition.top, left: navMenuPosition.left }}>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <div className={styles.section}>
            {modules?.length ? (
              <>
                <Modules
                  modules={modules}
                  activeModule={activeModule}
                  onModuleHover={onModuleHover}
                  handleModuleClick={handleModuleClick}
                />
                <Separator orientation="vertical" length="464px" />
                <ModuleItems
                  moduleItems={moduleItems}
                  selectedModuleItemId={selectedModuleItemId}
                  handleModuleItemClick={handleModuleItemClick}
                />
                <ModuleOverlayIcon data={hoveredModule ?? activeModule} />
              </>
            ) : (
              <NoResultsFound />
            )}
          </div>
        </div>
      </button>
    );
  }
);

NavMenu.displayName = 'NavMenu';

export default NavMenu;
