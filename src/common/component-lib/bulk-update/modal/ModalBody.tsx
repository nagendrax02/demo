import { lazy } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './modal.module.css';
import FormField from 'common/component-lib/form-field';
import Renderer from '../components/Renderer';
import EntityFieldDropdown from './EntityFieldDropdown';
import { InputId } from '../bulk-update.types';
import BulkSelectionMode from '../bulk-selection-mode/BulkSelectionMode';
import { useBulkUpdate } from '../bulk-update.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { UPDATE_ALL_ENTITY } from '../constant';
const SuccessMessage = withSuspense(lazy(() => import('./SuccessMessage')));

// eslint-disable-next-line complexity
const ModalBody = ({
  isLoading,
  handleClose,
  successModal
}: {
  isLoading: boolean;
  handleClose: () => void;
  successModal?: ({
    onClose,
    repPluralName
  }: {
    onClose: () => void;
    repPluralName?: string;
  }) => JSX.Element;
}): JSX.Element => {
  const error = useBulkUpdate((state) => state.error);
  const { fields } = useBulkUpdate((state) => state.bulkUpdateConfig);
  const errorMessage = useBulkUpdate((state) => state.errorMessage) || 'Required Field';
  const selectedField = useBulkUpdate((state) => state.selectedField);
  const isAsyncRequest = useBulkUpdate((state) => state.isAsyncRequest);
  const partialSuccessMessage = useBulkUpdate((state) => state.partialSuccess);
  const { PluralName, SingularName } = useBulkUpdate((state) => state.representationName);
  const leadLength = useBulkUpdate((state) => state?.initGridConfig?.entityIds?.length);
  const updateAllEntity = useBulkUpdate((state) => state?.initGridConfig?.gridConfig?.updateAll);

  if (isLoading) {
    return (
      <Modal.Body>
        <div className={styles?.body_shimmer}>
          <Shimmer height="100px" width="100%" />
          <Shimmer height="32px" width="100%" />
          <Shimmer height="32px" width="100%" />
        </div>
      </Modal.Body>
    );
  }

  const onSuccess = (): JSX.Element => {
    return successModal ? (
      successModal({ onClose: handleClose, repPluralName: PluralName })
    ) : (
      <SuccessMessage suspenseFallback={<Shimmer height="100px" width="100%" />} />
    );
  };

  return (
    <Modal.Body>
      {isAsyncRequest || partialSuccessMessage?.showCount ? (
        onSuccess()
      ) : (
        <>
          <BulkSelectionMode />
          {!updateAllEntity ? (
            <div className={styles.body_title}>
              {`Update ${SingularName} Field with new value for the selected ${
                leadLength > 1 ? PluralName : SingularName
              }`}
            </div>
          ) : null}

          <FormField
            title={`${SingularName} Field`}
            required
            errorMessage={error === InputId.SelectedField ? errorMessage : ''}
            suspenseFallback={<Shimmer height="32px" width="100%" />}>
            <div className={styles.dropdown_wrapper}>
              <EntityFieldDropdown fields={fields} />
            </div>
          </FormField>

          <FormField
            title="Update To"
            errorMessage={error === InputId.UpdateTo ? errorMessage : ''}
            required={selectedField?.isMandatory}
            suspenseFallback={<Shimmer height="32px" width="100%" />}>
            <Renderer />
          </FormField>
          {updateAllEntity ? (
            <div className={styles.note_msg}>{UPDATE_ALL_ENTITY.NOTE_MESSAGE}</div>
          ) : null}
        </>
      )}
    </Modal.Body>
  );
};

export default ModalBody;
