import { Type } from '@lsq/nextgen-preact/notification/notification.types';

export const DEFAULT_TAB_WIDTH = 264;

export const Setting = {
  ManageTabs: 'manage-tabs',
  AddNewTab: 'add-new-tab'
};

export const TabHeader = {
  SmartViews: 'Smart Views',
  ManageTabs: 'Manage'
};

export const DeleteModal = {
  title: 'Delete Tab',
  description:
    'Are you sure you want to delete {TAB_NAME} tab? You can not restore the tab once it is deleted.'
};

export const FooterText = {
  cancel: 'Cancel',
  save: 'Save'
};

export const ManageModal = {
  title: 'Manage Tabs',
  description: 'Set default tab and order tabs.'
};

export const alertConfig = {
  TAB_UPDATE_FAIL: {
    type: Type.ERROR,
    message: 'Tabs Updation failed'
  },
  TAB_UPDATE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Tabs Updated successfully'
  },
  TAB_DELETE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Tabs Deleted successfully'
  }
};
