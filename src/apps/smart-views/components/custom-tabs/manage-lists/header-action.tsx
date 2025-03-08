import { HeaderActionType } from 'apps/smart-views/constants/constants';
import { IHeaderAction } from '../../smartview-tab/smartview-tab.types';
import { HEADER_ACTION_ID } from '../../smartview-tab/components/header/header-actions/constant';
import { HEADER_ACTION_REP_NAME, HIDDEN_LIST } from './constants';
import { IMenuItem } from '@lsq/nextgen-preact/action-menu/action-menu.types';
import ActionIcon from '../../more-action/ActionIcon';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { AddEmptyList, AddToList } from 'src/assets/custom-icon/v2';
import { ShowListType } from './manage-lists.types';

export const getGearActionSubMenu = (isHiddenListSelected?: boolean): IMenuItem[] => {
  return [HIDDEN_LIST[isHiddenListSelected ? ShowListType.SHOW : ShowListType.HIDE]];
};

export const getListTabActions = (isHiddenListSelected?: boolean): IHeaderAction[] => {
  return [
    {
      id: HEADER_ACTION_ID.CreateEmptyList,
      actionType: HeaderActionType.SecondaryAction,
      title: HEADER_ACTION_REP_NAME[HEADER_ACTION_ID.CreateEmptyList],
      renderIcon: () => (
        <AddEmptyList
          type="outline"
          className={`${styles.action_icon} ${styles.secondary_action}`}
        />
      )
    },
    {
      id: HEADER_ACTION_ID.CreateNewList,
      actionType: HeaderActionType.QuickAction,
      title: HEADER_ACTION_REP_NAME[HEADER_ACTION_ID.CreateNewList],
      renderIcon: () => (
        <AddToList type="outline" className={`${styles.action_icon} ${styles.quick_action}`} />
      )
    },
    {
      id: 'more_actions',
      actionType: HeaderActionType.MoreAction,
      subMenu: getGearActionSubMenu(isHiddenListSelected),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.more_action} />} />
      )
    }
  ];
};
