/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import SideModal from '@lsq/nextgen-preact/side-modal';
import { isRestricted } from 'common/utils/permission-manager';
import {
  ActionType,
  PermissionEntityType
} from 'common/utils/permission-manager/permission-manager.types';
import { IFileLibrary } from './file-library.types';
import useFileLibraryStore from './file-library.store';
import Body from './components/body';
import styles from './file-library.module.css';

const FileLibrary = ({
  selectedFiles,
  setShow,
  maxFiles,
  maxFilesSize,
  onFilesSelect,
  libraryCategories,
  showFooter,
  isSingleSelect,
  callerSource
}: IFileLibrary): JSX.Element => {
  const { initializeStore, applyRestriction, resetStore } = useFileLibraryStore((state) => ({
    initializeStore: state.initializeStore,
    applyRestriction: state.applyRestriction,
    resetStore: state.resetStore
  }));

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  useEffect(() => {
    const IsContentRestricted = (action: ActionType): Promise<boolean> => {
      return isRestricted({
        entity: PermissionEntityType.Content,
        action,
        callerSource
      });
    };
    const promises = [
      IsContentRestricted(ActionType.Access),
      IsContentRestricted(ActionType.View),
      IsContentRestricted(ActionType.Update),
      IsContentRestricted(ActionType.Delete)
    ];
    Promise.allSettled(promises).then((results: PromiseSettledResult<boolean>[]) => {
      const [accessRestriction, viewRestriction, updateRestriction, deleteRestriction] =
        results.map((result) => (result.status === 'fulfilled' ? result.value : null));
      applyRestriction({
        view: viewRestriction || accessRestriction || false,
        update: updateRestriction || false,
        delete: deleteRestriction || false
      });
    });
  }, []);

  useEffect(() => {
    initializeStore({
      libraryCategories: libraryCategories,
      maxFiles: maxFiles || 5,
      maxFilesSize: maxFilesSize || 1024 * 10,
      selectedFiles: selectedFiles || [],
      showFooter: showFooter || false,
      onFilesSelect: onFilesSelect,
      setShow: setShow,
      isSingleSelect: isSingleSelect || false,
      callerSource
    });
  }, [libraryCategories, maxFiles, maxFilesSize]);

  return (
    <div>
      <SideModal show setShow={setShow} customStyleClass={styles.side_modal}>
        <SideModal.Body>
          <Body />
        </SideModal.Body>
      </SideModal>
    </div>
  );
};

export default FileLibrary;
