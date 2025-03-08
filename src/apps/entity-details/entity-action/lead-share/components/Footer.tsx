import { Variant } from 'common/types';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from '../lead-share.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => Promise<void>;
  isDisabled: boolean;
  isLoading: boolean;
}

const Footer = (props: IFooter): JSX.Element => {
  const { setShowModal, onSave, isDisabled, isLoading } = props;

  const handleCancel = (): void => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        text={'Send Email'}
        onClick={onSave}
        variant={Variant.Primary}
        disabled={isDisabled}
        dataTestId="lead-share-send-email"
        icon={isLoading ? <Spinner customStyleClass={styles.save_spinner} /> : undefined}
      />
      <Button text={'Cancel'} onClick={handleCancel} dataTestId="lead-share-cancel" />
    </>
  );
};

export default Footer;
