import styles from './activity-details-modal.module.css';
import { useEffect, useState, lazy } from 'react';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { httpGet, Module } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IActivityDetailsModal, IActivityFields } from './activity-details.types';
import Modal from '@lsq/nextgen-preact/modal';
import { augmentActivityDetails, canRenderNotes } from './utils';
import ModalBody from './ModalBody';
import { handleViewActivityForAccount } from 'common/utils/helpers/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const ActivityDetailsModal = ({
  leadId,
  entityId,
  activityId,
  close,
  renderNotes,
  headerTitle,
  isActivityHistory,
  callerSource,
  isAccountActivityHistoryTab
}: IActivityDetailsModal): JSX.Element => {
  const { showAlert } = useNotification();
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState('');
  const [activityDetails, setActivityDetails] = useState<IActivityFields[]>([]);

  // eslint-disable-next-line complexity
  const getActivityDetails = async (): Promise<void> => {
    if (activityId) {
      try {
        const path = isAccountActivityHistoryTab
          ? `${API_ROUTES.accountActivityDetails}?activityId=${activityId}`
          : `${API_ROUTES.activityDetails}?id=${activityId}`;

        const response: IActivityFields = await httpGet({
          path: path,
          module: Module.Marvin,
          callerSource: callerSource
        });

        if (response?.ActivityEvent && response && isAccountActivityHistoryTab) {
          response.Fields = await handleViewActivityForAccount(
            response?.ActivityEvent,
            response,
            callerSource
          );
        }

        setHeading(
          `${renderNotes || isAccountActivityHistoryTab ? 'Notable Activity Data - ' : ''}${
            response?.DisplayName || response?.ActivityDisplayName
          }`
        );
        const canShowNotes = canRenderNotes(response?.ActivityEvent);
        setActivityDetails(augmentActivityDetails(response, canShowNotes));

        setLoading(false);
      } catch (err) {
        showAlert({ type: Type.ERROR, message: (err?.message as string) || EXCEPTION_MESSAGE });
        setHeading('Activity Details');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getActivityDetails();
  }, [activityId]);

  const getHeader = (): JSX.Element => {
    return <>{loading ? <Shimmer width="300px" height="30px" /> : <div>{heading}</div>}</>;
  };

  const getHeaderTitle = (): string | JSX.Element => {
    if (heading && isAccountActivityHistoryTab) return heading;
    return headerTitle || getHeader();
  };

  return (
    <>
      {activityId ? (
        <Modal show>
          <Modal.Header
            title={getHeaderTitle()}
            onClose={close}
            customStyleClass={styles.conf_header}
          />
          <Modal.Body customStyleClass={styles.modal_body}>
            <ModalBody
              loading={loading}
              activityFields={activityDetails}
              activityId={activityId}
              leadId={leadId}
              entityId={entityId}
              isActivityHistory={isActivityHistory}
              callerSource={callerSource}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close} text={'Close'} />
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};

ActivityDetailsModal.defaultProps = {
  renderNotes: false
};
export default ActivityDetailsModal;
