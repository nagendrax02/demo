import SideModal from '@lsq/nextgen-preact/side-modal';
import styles from './manage-folder-modal.module.css';
import { CONSTANTS } from '../constants';
import { IFolder } from '../../../file-library.types';
import Folder, { AddNewFolder } from '../folder';

export interface IManageFolderModal {
  folders: IFolder[];
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageFolderModal = (props: IManageFolderModal): JSX.Element => {
  const { setShowModal, folders } = props;

  const getFolderOptions = (): JSX.Element[] => {
    return folders?.map((folder) => {
      return <Folder data={folder} key={folder.Path} />;
    });
  };

  return (
    <SideModal show setShow={setShowModal} customStyleClass={styles.modal}>
      <div className={styles.container}>
        <div className={styles.title}>{CONSTANTS.MANAGE_FOLDER}</div>
        <div className={styles.option_wrapper}>
          {getFolderOptions()}
          <AddNewFolder />
        </div>
      </div>
    </SideModal>
  );
};

export default ManageFolderModal;
