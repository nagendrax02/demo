import create from 'zustand';
import { JSX } from 'react';
import { IPosition } from '../drag-drop-modal/DragDropModal';

interface IModalStore {
  showModal: boolean;
  modalContent: JSX.Element | null;
  setModalContent: (content: JSX.Element | null) => void;
  initialPosition: IPosition;
  setInitialPosition: (xPos: number, yPos: number) => void;
}

const useMediaStore = create<IModalStore>((set) => ({
  showModal: false,
  modalContent: null,
  setModalContent: (content: JSX.Element | null): void => {
    set({
      modalContent: content,
      showModal: content !== null
    });
  },
  initialPosition: { x: 0, y: 0 },
  setInitialPosition: (xPos: number, yPos: number): void => {
    set({
      initialPosition: { x: xPos, y: yPos }
    });
  }
}));

export default useMediaStore;
