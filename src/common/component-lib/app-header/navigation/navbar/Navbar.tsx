import Separator from '@lsq/nextgen-preact/v2/separator';
import styles from './navbar.module.css';
import Home from './home';
import ModuleItems from './module-items';
import ModuleSelector from './module-selector';
import { forwardRef } from 'react';
import { INavigationReferenceMap } from '../../app-header.types';

interface INavBarProps {
  selectedModuleId: string;
  selectedModuleItemId: string;
  showNavMenu: boolean;
  toggleNavMenu: () => void;
  handleModuleItemClick: (id: string) => void;
  navigationReferenceMap: INavigationReferenceMap;
}

/**
 * This component displays only the selected navigation elements.
 */

const Navbar = forwardRef<HTMLDivElement, INavBarProps>(
  (
    {
      showNavMenu,
      toggleNavMenu,
      selectedModuleId,
      selectedModuleItemId,
      handleModuleItemClick,
      navigationReferenceMap
    },
    ref
  ): JSX.Element => {
    return (
      <div className={styles.container} ref={ref}>
        <Home />
        <Separator orientation="vertical" length="16px" />
        <ModuleSelector
          selectedModuleId={selectedModuleId}
          showNavMenu={showNavMenu}
          toggleNavMenu={toggleNavMenu}
          navigationReferenceMap={navigationReferenceMap}
        />
        <ModuleItems
          selectedModuleId={selectedModuleId}
          selectedModuleItemId={selectedModuleItemId}
          handleModuleItemClick={handleModuleItemClick}
          navigationReferenceMap={navigationReferenceMap}
        />
      </div>
    );
  }
);

Navbar.displayName = 'NavBar';

export default Navbar;
