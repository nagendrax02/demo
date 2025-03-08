import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';

export const menuDimension = { height: 400, width: 250 };
export const menuDimensionForSWlite = { height: 400, width: 280 };

export const profileIconsMap = {
  settings: {
    name: 'settings',
    variant: IconVariant.Filled
  },
  signout: {
    name: 'logout',
    variant: IconVariant.Filled
  },
  manageusers: {
    name: 'group',
    variant: IconVariant.Outlined
  }
};

export const NAV_MENU_PARENT_ID = {
  Opportunity: '13000'
};
export const CICOSuccessMsg: Record<string, string> = {
  CheckedOut: 'Checked-In successfully and your status is set to Online',
  CheckedIn: 'Checked-Out successfully and your status is set to Offline'
};
