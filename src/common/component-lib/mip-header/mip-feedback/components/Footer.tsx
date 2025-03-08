import { trackError } from 'common/utils/experience/utils/track-error';
import { Variant } from 'common/types/button.types';
import Modal from '@lsq/nextgen-preact/modal';
import { useState, lazy } from 'react';
import { primaryButton } from '../constant';
import { useMiPHeader } from '../../mip-header.store';
import styles from '../feedback.module.css';
import { CallerSource } from 'src/common/utils/rest-client';
import { IOnSubmit } from '../MiPFeedback.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IFooter {
  onClose: () => void;
  onSubmit: IOnSubmit;
}
const Footer = ({ onClose, onSubmit }: IFooter): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const clickedAction = useMiPHeader((state) => state.clickedAction) || '';

  const handleSave = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const utils = await import('../on-save');
      await utils.handleFeedbackSave(onSubmit, CallerSource.MiPSwitchBack);
    } catch (error) {
      trackError(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            text="Cancel"
            onClick={(): void => {
              onClose();
            }}
            disabled={isLoading}
            variant={Variant.Secondary}
          />

          <Button
            text={primaryButton[clickedAction] as string}
            onClick={(): void => {
              handleSave();
            }}
            disabled={isLoading}
            variant={Variant.Primary}
            isLoading={isLoading}
          />
        </div>
      </Modal.Footer>
    </>
  );
};

export default Footer;
