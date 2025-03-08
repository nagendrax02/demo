import { useState, lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import { IAutomationReport } from './automation.types';
import { Variant } from 'common/types';
import ReportGrid from './ReportGrid';
import styles from './automation.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const AutomationReport = (props: IAutomationReport): JSX.Element => {
  const { entityType, handleClose, entityId, representationName } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div>
      <Modal show customStyleClass={styles.automation_modal_container}>
        <Modal.Header
          title={`${representationName || 'Lead'} Automation Report`}
          onClose={(): void => {
            handleClose();
          }}
        />
        <Modal.Body
          customStyleClass={`${styles.custom_automation_body} ${
            isLoading ? styles.spinner_container : ''
          }`}>
          <ReportGrid
            entityType={entityType}
            entityId={entityId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            representationName={representationName}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            text="Close"
            onClick={(): void => {
              handleClose();
            }}
            variant={Variant.Secondary}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AutomationReport;
