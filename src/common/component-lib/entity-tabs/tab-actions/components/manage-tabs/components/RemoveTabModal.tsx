import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { Variant } from 'common/types';
import styles from '../manage-tabs.module.css';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

interface IRemoveTabModal {
  setShowModal: (show: boolean) => void;
  onRemove: () => void;
}
const RemoveTabModal = ({ setShowModal, onRemove }: IRemoveTabModal): JSX.Element => {
  return (
    <div data-testid="remove-tab-confirmation-modal">
      <ConfirmationModal
        show
        onClose={(): void => {
          setShowModal(false);
        }}
        customStyleClass={styles.confirmation_modal}
        title="Delete Tab"
        description={'Are you sure you want to delete this tab?'}
        buttonConfig={[
          {
            id: 1,
            name: 'No',
            variant: Variant.Primary,
            onClick: (): void => {
              setShowModal(false);
            },
            dataTestId: 'remove-tab-confirmation-no'
          },
          {
            id: 2,
            name: 'Yes, Delete',
            variant: Variant.Error,
            onClick: (): void => {
              onRemove();
              setShowModal(false);
            },
            showSpinnerOnClick: true,
            dataTestId: 'remove-tab-confirmation-yes'
          }
        ]}
      />
    </div>
  );
};

export default RemoveTabModal;
