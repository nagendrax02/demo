import React, { Suspense, useState } from 'react';
import { ACTIVITY } from 'apps/activity-history/constants';
import ActivityDetailsModal from 'common/component-lib/modal/activity-details-modal';
import styles from './view-activity.module.css';
import { CallerSource } from 'common/utils/rest-client';

export interface IViewActivity {
  activityId: string;
  type: number;
  activityName: string;
  leadId: string;
  opportunityId: string;
  isAccountActivityHistoryTab?: boolean;
}
const ViewActivity = (props: IViewActivity): JSX.Element | null => {
  const { activityId, type, activityName, leadId, opportunityId, isAccountActivityHistoryTab } =
    props;
  const [show, setShow] = useState(false);

  const onClick = (): void => {
    setShow(true);
  };

  const onClose = (): void => {
    setShow(false);
  };

  const getViewActivity = (): string => {
    if (type === ACTIVITY.CHANGE_LOG) {
      return 'View Activity';
    }
    if (!opportunityId && type === ACTIVITY.OPPORTUNITY_CHANGE_LOG) {
      return `View ${activityName}`;
    }
    return '';
  };

  const viewActivity = getViewActivity();

  return (
    <>
      {viewActivity ? (
        <>
          <div
            className={styles.link}
            onClick={onClick}
            onKeyDown={(e) => {
              if (e.code === 'Enter') setShow(true);
            }}
            data-testid="ah-view-activity">
            {viewActivity}
          </div>
          {show ? (
            <Suspense>
              <ActivityDetailsModal
                activityId={activityId}
                leadId={leadId}
                entityId={opportunityId}
                close={onClose}
                headerTitle="Activity Details"
                isActivityHistory
                callerSource={CallerSource.ActivityHistoryCustomActivity}
                isAccountActivityHistoryTab={isAccountActivityHistoryTab}
              />
            </Suspense>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default ViewActivity;
