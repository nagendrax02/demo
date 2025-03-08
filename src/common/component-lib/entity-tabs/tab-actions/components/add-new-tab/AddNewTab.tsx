import Modal from '@lsq/nextgen-preact/modal';
import Body from './components/Body';
import Footer from './components/Footer';
import style from './add-new-tab.module.css';
import useAddNewTab from './add-new-tab-store';
import { IHandleManageTabs } from '../../../types/entitytabs.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

export interface IAddNewTab {
  show: boolean;
  setShow: (show: boolean) => void;
  handleManageTab: IHandleManageTabs;
  coreData: IEntityDetailsCoreData;
}

const AddNewTab = (props: IAddNewTab): JSX.Element => {
  const { setShow, show, handleManageTab, coreData } = props;
  const reset = useAddNewTab((state) => state.reset);

  const closeModal = (): void => {
    reset();
    setShow(false);
  };

  return (
    <>
      <Modal show={show} customStyleClass={style.modal}>
        <Modal.Header
          title={'Add New Tab'}
          onClose={(): void => {
            closeModal();
          }}
        />
        <Body coreData={coreData} />
        <Footer closeModal={closeModal} handleManageTab={handleManageTab} />
      </Modal>
    </>
  );
};

export default AddNewTab;
