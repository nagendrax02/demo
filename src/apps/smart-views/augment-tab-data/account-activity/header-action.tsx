import { HeaderActionType } from 'apps/smart-views/constants/constants';
import { IHeaderAction } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { HEADER_ACTION_ID } from 'apps/smart-views/components/smartview-tab/components/header/header-actions/constant';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import styles from 'apps/smart-views/components/more-action/action.module.css';
import { AddAccountActivity } from 'src/assets/custom-icon/v2';

export const getActionsConfig = async ({
  activityRepName
}: {
  activityRepName: IEntityRepresentationName;
}): Promise<IHeaderAction[]> => {
  return [
    {
      id: HEADER_ACTION_ID.AccountActivityAddActivity,
      actionType: HeaderActionType.QuickAction,
      title: `Add ${activityRepName?.SingularName ?? 'Activity'}`,
      renderIcon: () => (
        <AddAccountActivity
          type="outline"
          className={`${styles.action_icon} ${styles.quick_action}`}
        />
      )
    }
  ];
};
