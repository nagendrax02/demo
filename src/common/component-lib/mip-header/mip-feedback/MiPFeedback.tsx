import Modal from '@lsq/nextgen-preact/modal';
import { useMiPHeader } from '../mip-header.store';
import styles from './feedback.module.css';
import { headerTitle } from './constant';
import Footer from './components/Footer';
import Body from './components/Body';
import { onFeedbackModalClose } from './mip-feedback.store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { IOnSubmit, IOnSubmitConfig } from './MiPFeedback.types';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';

interface IMiPFeedback {
  showFeedbackModal: boolean;
  onClose: () => void;
  onSubmit?: IOnSubmit;
}

const MiPFeedback = ({ onClose, onSubmit, showFeedbackModal }: IMiPFeedback): JSX.Element => {
  const clickedAction = useMiPHeader((state) => state.clickedAction) || '';
  const { showAlert } = useNotification();

  const handleOnClose = (): void => {
    onFeedbackModalClose();
    onClose();
  };

  const onFeedBackSubmit = (data: IOnSubmitConfig): void => {
    if (onSubmit) {
      onFeedbackModalClose();
      onSubmit(data);
    } else {
      showAlert({
        type: Type.SUCCESS,
        message: 'Issue reported successfully! Thank you for helping us improve'
      });
      handleOnClose();
    }
  };

  return (
    <Modal show={showFeedbackModal} customStyleClass={styles.modal}>
      <Modal.Header title={headerTitle?.[clickedAction] as string} onClose={handleOnClose} />
      <Body />
      <Footer onClose={handleOnClose} onSubmit={onFeedBackSubmit} />
    </Modal>
  );
};

MiPFeedback.defaultProps = {
  onSubmit: undefined
};

export default MiPFeedback;
