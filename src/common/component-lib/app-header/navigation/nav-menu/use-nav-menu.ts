import { useEffect, useState } from 'react';
import { INavigationItem } from '../../app-header.types';
import { getSearchTextFilteredData } from '../utils';
import { findNavItemById } from '../../utils/nav-item-utils';

interface IUseNavMenuProps {
  data: INavigationItem[];
  selectedModuleId: string;
}

interface IUseNavMenuHook {
  activeModule?: INavigationItem;
  hoveredModule?: INavigationItem;
  modules: INavigationItem[];
  moduleItems: INavigationItem[];
  onModuleHover: (module: INavigationItem) => void;
  onModuleMouseLeave: () => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

const useNavMenu = ({ data, selectedModuleId }: IUseNavMenuProps): IUseNavMenuHook => {
  const [hoveredModule, setHoveredModule] = useState<INavigationItem | undefined>();
  const [searchText, setSearchText] = useState<string>('');
  const onModuleHover = (module: INavigationItem): void => {
    setHoveredModule(module);
  };

  const onModuleMouseLeave = (): void => {
    setHoveredModule(undefined);
  };

  useEffect(() => {
    setHoveredModule(undefined);
  }, [searchText]);

  const filteredModules = searchText ? getSearchTextFilteredData(data, searchText) : data;

  const selectedModule = findNavItemById(selectedModuleId, filteredModules);

  const filteredModuleItems = hoveredModule?.SubMenu ?? selectedModule?.SubMenu ?? [];

  return {
    searchText,
    setSearchText,
    activeModule: selectedModule,
    hoveredModule: hoveredModule,
    modules: filteredModules,
    moduleItems: filteredModuleItems,
    onModuleHover,
    onModuleMouseLeave
  };
};

export default useNavMenu;
