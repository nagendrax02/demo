import withSuspense from '@lsq/nextgen-preact/suspense';
import { Variant } from 'common/types';
import style from '../feedback.module.css';
import { useState, lazy } from 'react';

const ConfirmationModal = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/modal/confirmation-modal'))
);

interface IConfirmation {
  onClose: (show: boolean) => void;
  onSubmit: () => Promise<void>;
}
const Confirmation = ({ onClose, onSubmit }: IConfirmation): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    await onSubmit();
    setIsLoading(false);
  };
  return (
    <div className={style.confirmation_modal}>
      <ConfirmationModal
        show
        onClose={(): void => {
          if (!isLoading) onClose(false);
        }}
        title="Are you sure you want to switch back?"
        description={` The new experience will become default soon and the old experience
        will not receive upgrades.`}
        buttonConfig={[
          {
            id: 1,
            name: 'No, Keep Using New Experience',
            variant: Variant.Primary,
            onClick: (): void => {
              onClose(false);
            },
            isDisabled: isLoading
          },
          {
            id: 2,
            name: 'Yes, Switch Back',
            variant: Variant.Secondary,
            onClick: (): void => {
              handleSubmit();
            },
            isLoading: isLoading,
            isDisabled: isLoading
          }
        ]}
      />
    </div>
  );
};

export default Confirmation;
