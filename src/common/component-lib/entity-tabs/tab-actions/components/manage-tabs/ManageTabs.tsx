import Modal from '@lsq/nextgen-preact/modal';
import { IHandleManageTabs } from '../../../types/entitytabs.types';
import styles from './manage-tabs.module.css';
import Body from './components/Body';
import Footer from './components/Footer';
import useManageTabs from './manage-tab.store';

export interface IManageTabs {
  show: boolean;
  setShow: (show: boolean) => void;
  handleManageTab: IHandleManageTabs;
}

const ManageTabs = (props: IManageTabs): JSX.Element => {
  const { setShow, show, handleManageTab } = props;
  const reset = useManageTabs((state) => state.reset);

  const closeModal = (): void => {
    setShow(false);
    reset();
  };

  return (
    <>
      <Modal show={show} customStyleClass={styles.modal}>
        <Modal.Header
          title={'Manage Tabs'}
          description={'Order tabs according to your requirement'}
          onClose={(): void => {
            closeModal();
          }}
        />
        <Body />
        <Footer closeModal={closeModal} handleManageTab={handleManageTab} />
      </Modal>
    </>
  );
};

export default ManageTabs;
