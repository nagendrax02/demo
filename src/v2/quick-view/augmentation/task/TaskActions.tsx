import { ReactNode } from 'react';
import { IQuickViewActionConfig } from '../augmentation.types';
import ButtonActions from 'apps/entity-details/components/vcard/actions/button-actions';
import { ITaskAdditionalData } from './task.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { getTaskActionActions } from './helpers';
import styles from './task.module.css';
import { classNames } from 'common/utils/helpers/helpers';

const TaskActions = ({
  actionConfig,
  entityRecord
}: {
  actionConfig: IQuickViewActionConfig;
  entityRecord: ITaskAdditionalData;
}): ReactNode => {
  const { actions, actionHelper } = actionConfig;

  const { badgeActions, buttonActions } = getTaskActionActions(actions, entityRecord);

  return (
    <div className={styles.action_wrapper}>
      {badgeActions?.length ? (
        <div>
          <ButtonActions
            coreData={actionHelper.coreData as IEntityDetailsCoreData}
            isSmartviews={actionHelper.isSmartviews as boolean}
            customConfig={actionHelper.customConfig as Record<string, string>}
            onSuccess={actionHelper.onSuccess as () => void}
            actions={badgeActions}
            entityRecords={[entityRecord]}
            customClass={styles.badge_button}
            renderAsV2Component
          />
        </div>
      ) : null}

      {buttonActions?.length ? (
        <div className={styles.icon_button_wrapper}>
          <ButtonActions
            coreData={actionHelper.coreData as IEntityDetailsCoreData}
            isSmartviews={actionHelper.isSmartviews as boolean}
            customConfig={actionHelper.customConfig as Record<string, string>}
            onSuccess={actionHelper.onSuccess as () => void}
            actions={buttonActions}
            entityRecords={[entityRecord]}
            customClass={classNames(styles.action, styles.icon_button)}
            renderAsV2Component
          />
        </div>
      ) : null}
    </div>
  );
};

export default TaskActions;
