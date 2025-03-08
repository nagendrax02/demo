import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import DragDropModal from 'common/component-lib/drag-drop-modal';
import useMediaStore from './media.store';
import { IPosition } from '../drag-drop-modal/DragDropModal';

const MediaModal = (): JSX.Element => {
  const { showModal, modalContent, initialPosition } = useMediaStore();

  const setPosition = (position: IPosition): void => {
    setItem(StorageKey.DragDropModal, position);
  };

  return (
    <>
      {showModal && modalContent ? (
        <DragDropModal
          modalContent={modalContent}
          initialPosition={getItem<IPosition>(StorageKey.DragDropModal) ?? initialPosition}
          setPosition={setPosition}
        />
      ) : null}
    </>
  );
};

export default MediaModal;
