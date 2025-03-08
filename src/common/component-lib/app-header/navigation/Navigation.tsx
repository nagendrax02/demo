import { INavigationItem, INavigationReferenceMap } from '../app-header.types';
import NavMenu from './nav-menu';
import Navbar from './navbar';
import useNavigation from './use-navigation';

interface INavigationProps {
  data: INavigationItem[];
  selectedModuleId: string;
  selectedModuleItemId: string;
  navigationReferenceMap: INavigationReferenceMap;
}

/**
 * This component manages the primary navigation of the application.
 */

const Navigation = ({
  data,
  selectedModuleId,
  selectedModuleItemId,
  navigationReferenceMap
}: INavigationProps): JSX.Element => {
  const {
    toggleNavMenu,
    showNavMenu,
    navBarRef,
    navMenuRef,
    navMenuPosition,
    handleModuleItemClick,
    handleModuleClick
  } = useNavigation(navigationReferenceMap);

  return (
    <>
      <Navbar
        selectedModuleId={selectedModuleId}
        selectedModuleItemId={selectedModuleItemId}
        showNavMenu={showNavMenu}
        toggleNavMenu={toggleNavMenu}
        ref={navBarRef}
        handleModuleItemClick={handleModuleItemClick}
        navigationReferenceMap={navigationReferenceMap}
      />
      {showNavMenu ? (
        <NavMenu
          data={data}
          selectedModuleId={selectedModuleId}
          selectedModuleItemId={selectedModuleItemId}
          navMenuPosition={navMenuPosition}
          handleModuleItemClick={handleModuleItemClick}
          handleModuleClick={handleModuleClick}
          ref={navMenuRef}
        />
      ) : null}
    </>
  );
};

export default Navigation;
