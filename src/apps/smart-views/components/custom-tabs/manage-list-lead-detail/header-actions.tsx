import { HEADER_ACTION_ID } from '../../smartview-tab/components/header/header-actions/constant';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IHeaderAction } from '../../smartview-tab/smartview-tab.types';
import { HeaderAction, HeaderActionType } from 'apps/smart-views/constants/constants';
import { ACTION } from 'apps/entity-details/constants';
import {
  HIDE_ALL_LEAD_LIST_ACTIONS,
  HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS,
  LIST_STATIC_ACTIONS,
  LIST_UPDATE_ALL_LEAD
} from './constants';
import { IConnectorConfig } from 'common/types/entity/lead';
import actionStyles from 'apps/smart-views/components/more-action/action.module.css';
import { ICustomActions } from 'common/types/entity/lead/custom-actions.types';
import { INTERNAL_LIST, LIST_SEND_EMAIL_LIMIT } from '../manage-lists/constants';
import { ListType } from 'apps/smart-views/smartviews.types';
import ActionIcon from '../../more-action/ActionIcon';
import Option from 'assets/custom-icon/v2/Option';
import { IListDetails } from './list-details.types';
import ScheduledEmailCount from './ScheduledEmailsCount';
import { AddLead } from 'assets/custom-icon/v2';
import styles from './manage-list-lead-detail.module.css';

const subMenuAction = ({
  actionSubmenu,
  moreActions,
  key
}: {
  actionSubmenu: IMenuItem[];
  moreActions: IMenuItem[];
  key: string;
}): void => {
  if (actionSubmenu.length === 1) {
    moreActions.push({
      ...actionSubmenu[0]
    });
  } else {
    moreActions.push({
      label: key,
      value: key,
      subMenu: [...actionSubmenu],
      id: key
    });
  }
};

const appendCustomActions = ({
  customActions,
  moreActions
}: {
  customActions: ICustomActions;
  moreActions: IMenuItem[];
}): IMenuItem[] => {
  if (customActions?.Single) {
    Object.keys(customActions?.Single)?.forEach((key) => {
      const actions = customActions?.Single?.[key] as IConnectorConfig[];
      if (actions?.length) {
        const actionSubmenu = [] as IMenuItem[];
        actions.forEach((item) => {
          actionSubmenu.push({
            id: item.Id,
            label: item.Config.DisplayText,
            value: item.Id,
            toolTip: item.Config.DisplayText,
            connectorConfig: item
          });
        });
        if (actionSubmenu.length) {
          subMenuAction({
            actionSubmenu,
            moreActions,
            key
          });
        }
      }
    });
  }
  return moreActions;
};

const getListActions = (
  actions: IMenuItem[],
  representationName?: IEntityRepresentationName
): IMenuItem[] => {
  const singularNameList = [HEADER_ACTION_ID.QuickAddLead, HEADER_ACTION_ID.AddNewLead];
  const pluralNameList = [ACTION.DeleteAllLead, ACTION.UpdateAllLead, HeaderAction.ExportLeads];
  return actions?.map((action) => {
    if (singularNameList.includes(action?.id as string)) {
      return {
        ...action,
        label: `${action?.label} ${representationName?.SingularName ?? 'Lead'}`,
        toolTip: `${action?.label} ${representationName?.SingularName ?? 'Lead'}`
      };
    }
    if (pluralNameList.includes(action?.id as string)) {
      return {
        ...action,
        label: `${action?.label} ${representationName?.PluralName ?? 'Lead'}`,
        toolTip: `${action?.label} ${representationName?.PluralName ?? 'Lead'}`
      };
    }

    return action;
  });
};

const hideInternalActions = ({
  listDetails,
  newListActions,
  representationName
}: {
  listDetails: IListDetails;
  newListActions: IMenuItem[];
  representationName?: IEntityRepresentationName;
}): IMenuItem[] => {
  if (listDetails?.InternalName === INTERNAL_LIST.STARRED_LEADS) {
    return newListActions?.filter((action) => action?.id !== ACTION.ListEdit);
  } else if (listDetails?.InternalName === INTERNAL_LIST.ALL_LEADS) {
    return newListActions
      ?.filter((action) => !HIDE_ALL_LEAD_LIST_ACTIONS.includes(action?.id as string))
      ?.map((action) => {
        if (
          action?.id === ACTION.UpdateAllLead &&
          listDetails?.MemberCount > LIST_UPDATE_ALL_LEAD.MAX
        ) {
          return {
            ...action,
            disabled: true,
            toolTip: `You can update only ${LIST_UPDATE_ALL_LEAD.MAX} ${representationName?.PluralName} in this list`
          };
        }
        return action;
      });
  }
  return newListActions;
};

const reduceActions = ({
  listStaticActions,
  listDetails,
  representationName
}: {
  listStaticActions: IMenuItem[];
  listDetails: IListDetails;
  representationName?: IEntityRepresentationName;
}): IMenuItem[] => {
  let reducedActions = listStaticActions;
  reducedActions = hideInternalActions({
    listDetails,
    newListActions: reducedActions,
    representationName
  });

  if (
    listDetails?.ListType === ListType.DYNAMIC ||
    listDetails?.ListType === ListType.REFRESHABLE
  ) {
    reducedActions = reducedActions?.filter(
      (action) => !HIDE_DYNAMIC_AND_REFRESHABLE_ACTIONS.includes(action?.id as string)
    );
  }

  return reducedActions;
};

const getMoreActionSubMenu = (
  customActions: ICustomActions,
  listDetails: IListDetails,
  representationName?: IEntityRepresentationName
): IMenuItem[] => {
  const listStaticActions = getListActions(LIST_STATIC_ACTIONS, representationName);
  const reducedActions = reduceActions({ listStaticActions, listDetails, representationName });
  const actions = appendCustomActions({
    moreActions: reducedActions,
    customActions
  });

  return actions;
};

const getScheduledEmails = (
  buttonActions: IHeaderAction[],
  scheduledEmails: Record<string, number>
): void => {
  if (Object.keys(scheduledEmails)?.length) {
    buttonActions?.push({
      id: ACTION.ViewScheduledEmail,
      actionType: HeaderActionType.IconAction,
      toolTip: 'Scheduled Emails',
      value: ACTION.ViewScheduledEmail,
      renderIcon: () => <ScheduledEmailCount />
    });
  }
};

const getSendEmailActionConfig = (
  listDetails: IListDetails,
  representationName?: IEntityRepresentationName
): Record<string, string | boolean> => {
  if (listDetails?.MemberCount > LIST_SEND_EMAIL_LIMIT.MAX) {
    return {
      toolTipText: `You can send Email to only upto ${LIST_SEND_EMAIL_LIMIT.MAX} ${
        representationName?.PluralName ?? 'Leads'
      } at a time.`,
      isDisabled: true
    };
  }

  if (listDetails?.MemberCount === 0) {
    return { toolTipText: 'List is empty. Cannot send email', isDisabled: true };
  }

  return { toolTipText: '', isDisabled: false };
};

const getSendEmail = (
  buttonActions: IHeaderAction[],
  listDetails: IListDetails,
  representationName?: IEntityRepresentationName
): void => {
  const { toolTipText, isDisabled } = getSendEmailActionConfig(listDetails, representationName);
  buttonActions?.push({
    id: ACTION.SendEmailAction,
    toolTip: toolTipText as string,
    actionType: HeaderActionType.SecondaryAction,
    title: 'Send Email',
    disabled: isDisabled as boolean
  });
};

const getAddLead = (
  buttonActions: IHeaderAction[],
  listDetails: IListDetails,
  representationName?: IEntityRepresentationName
): void => {
  if (listDetails?.ListType === ListType.STATIC)
    buttonActions?.push({
      id: ACTION.ListAddMore,
      actionType: HeaderActionType.QuickAction,
      title: `Add ${representationName?.PluralName ?? 'Leads'}`,
      disabled: false,
      renderIcon: () => <AddLead type="outline" className={styles.add_lead_icon} />
    });
};

const getButtonActions = ({
  representationName,
  listDetails,
  scheduledEmails
}: {
  representationName?: IEntityRepresentationName;
  listDetails: IListDetails;
  scheduledEmails: Record<string, number>;
}): IHeaderAction[] => {
  const buttonActions: IHeaderAction[] = [];

  getScheduledEmails(buttonActions, scheduledEmails);
  getSendEmail(buttonActions, listDetails, representationName);
  getAddLead(buttonActions, listDetails, representationName);

  return buttonActions;
};

export const getListDetailsHeaderActions = ({
  customActions,
  representationName,
  listDetails,
  scheduledEmails
}: {
  customActions: ICustomActions;
  representationName?: IEntityRepresentationName;
  listDetails: IListDetails;
  scheduledEmails: Record<string, number>;
}): IHeaderAction[] => {
  return [
    ...getButtonActions({
      representationName,
      listDetails,
      scheduledEmails
    }),
    {
      id: 'more_actions',
      actionType: HeaderActionType.MoreAction,
      subMenu: getMoreActionSubMenu(customActions, listDetails, representationName),
      renderIcon: () => (
        <ActionIcon icon={<Option type="outline" className={actionStyles.more_action} />} />
      )
    }
  ];
};
