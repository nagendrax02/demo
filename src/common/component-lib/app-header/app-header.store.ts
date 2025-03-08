import { create } from 'zustand';
import { IAppHeaderData, IAppHeaderStore, INavigationReferenceMap } from './app-header.types';

const initialState: IAppHeaderStore = {
  isLoading: true,
  appHeaderData: {
    HomeConfiguration: {
      Id: '10',
      Label: 'Dashboard',
      HomePageURL: '/LeadManagement/SmartViews',
      DashboardURL: '/Dashboard/',
      IsCasaEnabled: false,
      IsSieraEnabled: false
    },
    NavigationMenu: [],
    Actions: []
  },
  navigationReferenceMap: {},
  selectedModuleId: '',
  selectedModuleItemId: ''
};

const useAppHeaderStore = create<IAppHeaderStore>(() => ({
  ...initialState
}));

const setAppHeaderData = (rawData: IAppHeaderData): void => {
  useAppHeaderStore.setState({ appHeaderData: rawData });
};

const setIsAppHeaderLoading = (isLoading: boolean): void => {
  useAppHeaderStore.setState({ isLoading: isLoading });
};

const setSelectedModuleId = (newModuleId: string): void => {
  useAppHeaderStore.setState({ selectedModuleId: newModuleId });
};

const setSelectedModuleItemId = (newModuleItemId: string): void => {
  useAppHeaderStore.setState({ selectedModuleItemId: newModuleItemId });
};

const setNavigationReferenceMap = (navigationReferenceMap: INavigationReferenceMap): void => {
  useAppHeaderStore.setState({ navigationReferenceMap });
};

export {
  setAppHeaderData,
  setSelectedModuleId,
  setSelectedModuleItemId,
  setIsAppHeaderLoading,
  setNavigationReferenceMap
};

export default useAppHeaderStore;
