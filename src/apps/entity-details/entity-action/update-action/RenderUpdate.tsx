import Modal from '@lsq/nextgen-preact/modal';
import styles from './Update.module.css';
import { Variant } from 'common/types';
import Body from './Body';
import { IRenderUpdate } from './update.types';
import { getSelectedSchemaName } from '../helper';
import { getUpdateModalTitle } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const UpdateQueued = withSuspense(lazy(() => import('./UpdateQueued')));

const RenderUpdate = (props: IRenderUpdate): JSX.Element => {
  const {
    leadRepresentationName,
    actionType,
    compRender,
    getBodyTitle,
    required,
    handleClose,
    handleApiCall,
    isLoading,
    disabledSave,
    showError,
    directRenderComponent,
    entityDetailsCoreData,
    sendCalenderInvite,
    setSendCalenderInvite,
    selectedEntityCount,
    isAsyncReq
  } = props;

  const { entityDetailsType } = entityDetailsCoreData;

  return (
    <Modal show customStyleClass={styles.modal}>
      <Modal.Header
        title={getUpdateModalTitle(actionType)}
        onClose={(): void => {
          handleClose();
        }}
      />
      <Modal.Body customStyleClass={styles.body}>
        {isAsyncReq ? (
          <UpdateQueued />
        ) : (
          <Body
            leadRepresentationName={leadRepresentationName}
            actionType={actionType}
            compRender={compRender}
            getBodyTitle={getBodyTitle}
            selectedEntityCount={selectedEntityCount}
            required={required}
            showError={showError}
            entityDetailsCoreData={entityDetailsCoreData}
            selectedSchema={getSelectedSchemaName(entityDetailsType, actionType)}
            directRenderComponent={directRenderComponent}
            sendCalenderInvite={sendCalenderInvite}
            setSendCalenderInvite={setSendCalenderInvite}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <>
          {!isAsyncReq ? (
            <Button
              text="Save"
              onClick={(): void => {
                handleApiCall();
              }}
              isLoading={isLoading}
              disabled={disabledSave}
              variant={Variant.Primary}
            />
          ) : null}
          <Button
            text={isAsyncReq ? 'Close' : 'Cancel'}
            onClick={(): void => {
              handleClose();
            }}
            variant={Variant.Secondary}
          />
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default RenderUpdate;
