import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  HeaderAction,
  HeaderActionType,
  TABS_DEFAULT_ID
} from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { TaskActionIds } from './constants';
import { isManageTab } from 'apps/smart-views/utils/utils';
import { workAreaIds } from 'common/utils/process';
import ActionIcon from '../../components/more-action';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { LeadList, DateAndTime, AddTask } from 'assets/custom-icon/v2';

const getMoreActionSubMenu = (taskRepName: string, isCalendarView: boolean): IMenuItem[] => {
  return [
    {
      label: `Export ${taskRepName}`,
      value: HeaderAction.ExportLeads,
      disabled: isCalendarView
    }
  ];
};

export const getTaskTabActions = ({
  taskRepName,
  tabId,
  isCalendarView,
  leadTypeForProcess
}: {
  taskRepName: string;
  tabId: string;
  isCalendarView: boolean;
  leadTypeForProcess?: string;
}): IHeaderAction[] => {
  return [
    {
      id: TaskActionIds.LIST_VIEW,
      actionType: HeaderActionType.ToggleAction,
      renderIcon: () => <LeadList type="outline" className={styles.toggle_type} />,
      isActive: !isCalendarView,
      toolTip: 'List View'
    },
    {
      id: TaskActionIds.CALENDAR_VIEW,
      actionType: HeaderActionType.ToggleAction,
      renderIcon: () => <DateAndTime type="outline" className={styles.toggle_type} />,
      isActive: isCalendarView,
      toolTip: 'Calendar View'
    },
    {
      id: TaskActionIds.CREATE_TASK,
      actionType: HeaderActionType.QuickAction,
      title: `Add ${taskRepName}`,
      workAreaConfig: {
        workAreaId: isManageTab(tabId)
          ? workAreaIds.MANAGE_TASKS.ADD
          : workAreaIds.SMART_VIEWS.TASK_TAB.ADD,
        additionalData: isManageTab(tabId) ? `${leadTypeForProcess ?? ''}` : tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      },
      renderIcon: () => (
        <AddTask type="outline" className={`${styles.action_icon} ${styles.quick_action}`} />
      )
    },
    {
      id: TaskActionIds.MORE_ACTIONS,
      actionType: HeaderActionType.MoreAction,
      subMenu: getMoreActionSubMenu(taskRepName, isCalendarView),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.action_icon} />} />
      )
    }
  ];
};
