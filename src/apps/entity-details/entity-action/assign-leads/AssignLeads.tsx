import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import { useState, lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { IEntityRepresentationName } from '../../types/entity-data.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IAssignLeads } from './assign-leads.types';
import styles from './assign-leads.module.css';
import { Variant } from 'common/types';
import ModalBody from './ModalBody';
import useAssignLeadsStore, { useLeadRecords } from './assignleads.store';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const AssignLeads = (props: IAssignLeads): JSX.Element => {
  const { handleClose, accountId, accountType } = props;

  const { showAlert } = useNotification();

  const [show, setShow] = useState(true);

  const { isLoading, setIsLoading, disabledSave, resetAssignLeadsStore } = useAssignLeadsStore();

  const leadRecords = useLeadRecords();

  const leadRepresentationName = getItem(
    StorageKey.LeadRepresentationName
  ) as IEntityRepresentationName;

  const handleApiCall = async (): Promise<void> => {
    if (accountId && accountType) {
      setIsLoading(true);
      try {
        const leadIdsArray: string[] = [];
        leadRecords.forEach((lead) => {
          leadIdsArray.push(lead?.id);
        });

        const path = API_ROUTES.assignLeads;
        const body = {
          CompanyId: accountId,
          CompanyTypeId: accountType,
          SearchText: '',
          AdvancedSearchTextNew: '',
          LeadIds: leadIdsArray
        };
        const response = (await httpPost({
          path,
          module: Module.Marvin,
          body,
          callerSource: CallerSource.AssignLeads
        })) as unknown as Record<string, string>;

        if (response && !response?.FailureCount && response?.SuccessCount) {
          showAlert({
            type: Type.SUCCESS,
            message: `${response?.SuccessCount} ${
              leadRepresentationName?.SingularName || 'Lead'
            } Updated Successfully`
          });
          resetAssignLeadsStore();
          updateLeadAndLeadTabs();
          handleClose();
        } else {
          showAlert({
            type: Type.ERROR,
            message: `${response?.FailureCount} ${
              leadRepresentationName?.SingularName || 'Lead'
            } Updation Failed`
          });
        }
        setShow(false);
        setIsLoading(false);
      } catch (error) {
        trackError(error);
        showAlert({
          type: Type.ERROR,
          message: EXCEPTION_MESSAGE
        });
        setShow(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal show={show} customStyleClass={styles.modal_container}>
      <Modal.Header
        title={`Assign Existing ${leadRepresentationName?.PluralName}`}
        onClose={(): void => {
          handleClose();
          resetAssignLeadsStore();
        }}
      />
      <Modal.Body customStyleClass={styles.modal_body_container}>
        <ModalBody accountId={accountId} />
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button
            dataTestId="ok-button"
            text="Assign"
            onClick={handleApiCall}
            disabled={disabledSave}
            variant={Variant.Primary}
            isLoading={isLoading}
          />
          <Button
            text="Cancel"
            onClick={(): void => {
              handleClose();
              resetAssignLeadsStore();
            }}
            variant={Variant.Secondary}
          />
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignLeads;
