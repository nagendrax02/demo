import React, { lazy } from 'react';
import { Variant } from 'common/types';
import Spinner from '@lsq/nextgen-preact/spinner';
import styles from './addnotes.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';

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
        text={'Save'}
        onClick={onSave}
        variant={Variant.Primary}
        disabled={isDisabled}
        dataTestId="add-notes-save"
        icon={isLoading ? <Spinner customStyleClass={styles.save_spinner} /> : undefined}
      />
      <Button text={'Cancel'} onClick={handleCancel} dataTestId="add-notes-cancel" />
    </>
  );
};

export default Footer;
