import { useEffect, useRef, useState } from 'react';
import { INavigationReferenceMap } from '../app-header.types';
import { useLocation } from 'wouter';
import { onModuleClick, onModuleItemClick } from '../utils/nav-item-utils';

interface IUseNavigationHook {
  showNavMenu: boolean;
  toggleNavMenu: () => void;
  navBarRef: React.MutableRefObject<HTMLDivElement | null>;
  navMenuRef: React.MutableRefObject<HTMLDivElement | null>;
  navMenuPosition: {
    top: number;
    left: number;
  };
  handleModuleItemClick: (id: string) => void;
  handleModuleClick: (id: string) => void;
}

// eslint-disable-next-line max-lines-per-function
const useNavigation = (navigationReferenceMap: INavigationReferenceMap): IUseNavigationHook => {
  const [showNavMenu, setShowNavMenu] = useState<boolean>(false);
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const [navMenuPosition, setNavMenuPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0
  });
  const [, setLocation] = useLocation();

  const handleOutsideClick = (event: MouseEvent): void => {
    if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
      setShowNavMenu(false);
    }
  };

  useEffect(() => {
    if (navBarRef.current) {
      const rect = navBarRef.current?.getBoundingClientRect();
      setNavMenuPosition({ top: rect.bottom + 10, left: rect.left + 45 });
    }
    if (showNavMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showNavMenu]);

  const toggleNavMenu = (): void => {
    setShowNavMenu((prev) => !prev);
  };

  const handleModuleItemClick = (id: string): void => {
    onModuleItemClick({ moduleItemId: id, setLocation, navigationReferenceMap });
    setShowNavMenu(false);
  };

  const handleModuleClick = (id: string): void => {
    onModuleClick({ moduleId: id, setLocation, navigationReferenceMap });
    setShowNavMenu(false);
  };

  return {
    showNavMenu,
    toggleNavMenu,
    navBarRef,
    navMenuRef,
    navMenuPosition,
    handleModuleItemClick,
    handleModuleClick
  };
};

export default useNavigation;
