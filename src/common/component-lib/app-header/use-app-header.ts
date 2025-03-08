import { useEffect } from 'react';
import { IAppHeaderData, INavigationReferenceMap } from './app-header.types';
import useAppHeaderStore from './app-header.store';
import { initializeAppHeaderData } from './utils/initialize-data';
import { useLocation } from 'wouter';

interface IUseAppHeaderHook {
  appHeaderData: IAppHeaderData;
  selectedModuleId: string;
  selectedModuleItemId: string;
  navigationReferenceMap: INavigationReferenceMap;
}

const useAppHeader = (): IUseAppHeaderHook => {
  const appHeaderData = useAppHeaderStore((state) => state.appHeaderData);
  const selectedModuleId = useAppHeaderStore((state) => state.selectedModuleId);
  const selectedModuleItemId = useAppHeaderStore((state) => state.selectedModuleItemId);
  const navigationReferenceMap = useAppHeaderStore((state) => state.navigationReferenceMap);

  const [, setLocation] = useLocation();

  useEffect(() => {
    initializeAppHeaderData({ setLocation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    appHeaderData,
    selectedModuleId,
    selectedModuleItemId,
    navigationReferenceMap
  };
};

export default useAppHeader;
