import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import Settings from './settings';
import Logout from './logout';

export const ACTIONS = {
  SETTINGS: 'setting',
  SIGN_OUT: 'signOut'
};

export const ACTION: IMenuItem[] = [
  {
    id: '300',
    label: 'Settings',
    value: ACTIONS.SETTINGS,
    customComponent: <Settings />,
    subMenu: []
  },
  {
    id: '302',
    label: 'Sign Out',
    value: ACTIONS.SIGN_OUT,
    customComponent: <Logout />,
    subMenu: []
  }
];

export const STATUS_INFO = {
  CheckedInStatusList: [
    { Name: 'online', Color: 'rgb(var(--marvin-success-1))' },
    { Name: 'Away', Color: 'rgb(var(--marvin-warning-1))' }
  ],
  CheckedOutStatusList: [{ Name: 'offline', Color: 'rgb(var(--marvin-quaternary-text))' }]
};
