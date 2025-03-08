import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  HeaderAction,
  HeaderActionType,
  TABS_DEFAULT_ID
} from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HEADER_ACTION_ID } from '../../components/smartview-tab/components/header/header-actions/constant';
import { getTooltipContent, isSmartviewTab } from '../../utils/utils';
import { workAreaIds } from 'common/utils/process';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getLeadRepresentationName } from '../../smartviews-store';
import { IUserPermission } from '../../smartviews.types';
import ActionIcon from '../../components/more-action';
import Option from 'src/assets/custom-icon/v2/Option';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import AddAccount from 'src/assets/custom-icon/v2/AddAccount';

const getMoreActionSubMenu = (
  accPluralRepName: string,
  userPermissions: IUserPermission
): IMenuItem[] => {
  return [
    {
      label: `Import ${accPluralRepName || 'Accounts'}`,
      value: HeaderAction.ImportLeads,
      showInWeb: true,
      showInMobile: false,
      disabled: !userPermissions?.import,
      toolTip: getTooltipContent(!userPermissions?.import) || `Import ${accPluralRepName}`
    },
    {
      label: `Export ${accPluralRepName || 'Accounts'}`,
      value: HeaderAction.ExportLeads,
      showInWeb: true,
      showInMobile: false
    }
  ];
};

export const getAccountTabActions = ({
  tabId,
  representationName,
  userPermissions
}: {
  tabId: string;
  representationName: IEntityRepresentationName;
  userPermissions: IUserPermission;
}): IHeaderAction[] => {
  if (!isSmartviewTab(tabId)) {
    return [];
  }
  return [
    {
      id: HEADER_ACTION_ID.AccountAddNewLead,
      title: `Add New ${getLeadRepresentationName()?.SingularName || 'Lead'}`,
      actionType: HeaderActionType.SecondaryAction,
      value: HEADER_ACTION_ID.AccountAddNewLead,
      workAreaConfig: {
        workAreaId: workAreaIds.NA,
        additionalData: tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      }
    },
    {
      id: 'add_account',
      actionType: HeaderActionType.QuickAction,
      title: `Add ${representationName?.SingularName || 'Account'}`,
      workAreaConfig: {
        workAreaId: workAreaIds.NA,
        additionalData: tabId,
        fallbackAdditionalData: TABS_DEFAULT_ID
      },
      disabled: !userPermissions?.create,
      toolTip:
        getTooltipContent(!userPermissions?.create) ||
        `Add ${representationName?.SingularName || 'Account'}`,
      renderIcon: () => (
        <AddAccount type="outline" className={`${styles.action_icon} ${styles.quick_action}`} />
      )
    },
    {
      id: 'more_actions',
      actionType: HeaderActionType.MoreAction,
      subMenu: getMoreActionSubMenu(representationName?.PluralName || '', userPermissions)?.filter(
        (action) => action?.showInWeb
      ),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={styles.action_icon} />} />
      )
    }
  ];
};
