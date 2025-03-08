import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useState } from 'react';
import styles from './schedule-email.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { ICancelResponse, IEmailCols, OperationStatus } from './schdeule-email.types';
import { Theme, Variant } from 'common/types';
import { API_ROUTES } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { IError } from 'common/types/error.types';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));
const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

const CancelAction = ({ record }: { record: IEmailCols }): JSX.Element => {
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  const onClick = (): void => {
    setShowCancelModal(true);
  };

  const { setNotification } = useNotificationStore();

  const handleCancel = async (): Promise<void> => {
    try {
      const path = `${API_ROUTES.cancelScheduledEmail}${record.id}&campaignMemberId=${record.leadId}&type=4&cancelAllInCampaign=true`;
      const response = (await httpPost({
        path,
        module: Module.Marvin,
        body: {
          EventNote: ''
        },
        callerSource: CallerSource.ScheduledEmail
      })) as ICancelResponse;

      if (response.Status === OperationStatus.SUCCESS) {
        setNotification({
          type: Type.SUCCESS,
          message: 'Email Cancelled Successfully'
        });
      }
      record.cancelledAction(record.id);
      setShowCancelModal(false);
    } catch (error) {
      trackError(error);
      setShowCancelModal(false);
      setNotification({
        type: Type.ERROR,
        message: (error as IError)?.response?.ExceptionMessage
      });
    }
  };

  return (
    <>
      <div className={styles.action_container} onClick={onClick}>
        <Icon name="cancel" customStyleClass={styles.custom_icon_style} />
        <div>
          <Tooltip
            content="Cancel"
            trigger={[Trigger.Hover]}
            placement={Placement.Vertical}
            theme={Theme.Dark}>
            <>Cancel</>
          </Tooltip>
        </div>
      </div>
      <>
        {showCancelModal ? (
          <ConfirmationModal
            onClose={() => {
              setShowCancelModal(false);
            }}
            show={showCancelModal}
            title={`Cancel Scheduled Email`}
            customStyleClass={styles.cancel_modal}
            description={
              <div className={styles.description}>
                Are you sure you want to cancel the scheduled email?
              </div>
            }
            buttonConfig={[
              {
                id: 1,
                name: 'No',
                variant: Variant.Primary,
                onClick: (): void => {
                  setShowCancelModal(false);
                }
              },
              {
                id: 2,
                name: 'Yes, Cancel',
                variant: Variant.Secondary,
                onClick: handleCancel,
                showSpinnerOnClick: true,
                customStyleClass: styles.secondary_button
              }
            ]}
          />
        ) : null}
      </>
    </>
  );
};

export default CancelAction;
