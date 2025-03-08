import { create } from 'zustand';
import { INavItem, ICICOStatusConfig } from './header.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IAuthenticationConfig } from 'common/types';
import { isUserCheckedIn } from './components/profile/utils';
import { safeParseJson } from 'common/utils/helpers';
import { STATUS_INFO } from './components/profile/constants';

interface IHeaderStore {
  isLoading: boolean;
  showOverlay: boolean;
  navItems: INavItem[];
  activeNavItemName: string;
  externalAppsWithOnRenderRegistered: Record<string, boolean>;
  setIsLoading: (loading: boolean) => void;
  setNavItems: (navItems: INavItem[]) => void;
  setActiveNavItemName: (name: string) => void;
  removeNavItem: (navItem: INavItem) => void;
  checkInCheckOutEnabled: boolean;
  CICOStatusConfig: ICICOStatusConfig;
  currentStatus: string;
  userCheckedIn: boolean;
  setUserCheckedIn: (userCheckedIn: boolean) => void;
  setOnRenderRegistration: (name: string) => void;
  isLogoutTriggered: boolean;
  setIsLogoutTriggered: (isTriggered: boolean) => void;
  restrictedFeatures: Record<string, boolean>;
  setRestrictedFeature: (restrictedFeatureName: string) => void;
}

const initialState = {
  navItems: [],
  isLoading: true,
  showOverlay: false,
  checkInCheckOutEnabled: true,
  autoCheckOutOnSignOut: false,
  CICOStatusConfig: {
    CheckedInStatusList: [],
    CheckedOutStatusList: []
  },
  currentStatus: '',
  userCheckedIn: isUserCheckedIn(),
  activeNavItemName: '-1',
  externalAppsWithOnRenderRegistered: {},
  isLogoutTriggered: false,
  restrictedFeatures: {}
};

// eslint-disable-next-line max-lines-per-function
const useHeaderStore = create<IHeaderStore>((set) => ({
  // state
  ...initialState,

  // setState
  setIsLoading: (loading: boolean): void => {
    set({
      isLoading: loading
    });
  },
  setNavItems: (navItems: INavItem[]): void => {
    set(() => ({
      navItems
    }));
  },
  setActiveNavItemName: (name: string): void => {
    set(() => ({
      activeNavItemName: name
    }));
  },
  removeNavItem: (navItem: INavItem): void => {
    set((state) => ({
      navItems: state?.navItems?.filter((item) => item.Name !== navItem.Name)
    }));
  },

  setUserCheckedIn: (userCheckedIn: boolean): void => {
    set({ userCheckedIn: userCheckedIn });
  },

  setOnRenderRegistration: (name: string): void => {
    set((state) => ({
      externalAppsWithOnRenderRegistered: {
        ...state.externalAppsWithOnRenderRegistered,
        [name]: true
      }
    }));
  },

  setIsLogoutTriggered: (isTriggered: boolean): void => {
    set({ isLogoutTriggered: isTriggered });
  },

  setRestrictedFeature: (restrictedFeatureName: string): void => {
    set((state) => ({
      restrictedFeatures: { ...(state.restrictedFeatures || {}), [restrictedFeatureName]: true }
    }));
  }
}));

export const initializeStore = (): void => {
  const { User, Tenant } = (getItem(StorageKey.Auth) as IAuthenticationConfig) || {};

  useHeaderStore.setState((state) => {
    return {
      ...state,
      CICOStatusConfig:
        (safeParseJson(Tenant?.CICOStatusConfiguration || '') as ICICOStatusConfig) || STATUS_INFO,
      checkInCheckOutEnabled: User?.IsCheckInCheckOutEnabled,
      autoCheckOutOnSignOut: User?.AutoCheckOutOnSignOut,
      currentStatus: User?.AvailabilityStatus || '',
      isLogoutTriggered: false
    };
  });
};

export const showHeaderOverlay = (canShow: boolean): void => {
  document.body.style.overflow = canShow ? 'hidden' : 'initial';
  useHeaderStore.setState(() => ({ showOverlay: canShow }));
};

export default useHeaderStore;
