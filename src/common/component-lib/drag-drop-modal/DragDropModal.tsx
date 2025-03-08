import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

export interface IPosition {
  x: number;
  y: number;
}
interface IDragDropModal {
  modalContent: JSX.Element;
  initialPosition: IPosition;
  setPosition?: (position: IPosition) => void;
}

const DragDropModal = ({
  modalContent,
  initialPosition,
  setPosition
}: IDragDropModal): JSX.Element => {
  const positionRef = useRef(initialPosition);
  const clickedPosRef = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent): void => {
    if (dragging && modalRef.current) {
      // calculate x and y position while mouse is moving from original position
      const diffX = e.clientX - clickedPosRef.current.x;
      const diffY = e.clientY - clickedPosRef.current.y;

      // used to get dimensions of screen and modal
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;

      // used for new position after dragging
      let newX = positionRef.current.x + diffX;
      let newY = positionRef.current.y + diffY;

      // calculate so that modal is in viewport only
      newX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));

      positionRef.current = { x: newX, y: newY };
      clickedPosRef.current = { x: e.clientX, y: e.clientY };

      // update the modal position and the clicked position
      modalRef.current.style.top = newY + 'px';
      modalRef.current.style.left = newX + 'px';
    }
  };

  const handleMouseUp = (): void => {
    setDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    clickedPosRef.current = { x: e.clientX, y: e.clientY }; // dragging is set to true and we track position while dragging
    setDragging(true);
  };

  useEffect(() => {
    if (!modalContent) return;

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else if (setPosition) {
      setPosition(positionRef.current);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const modal = (
    <div
      className={styles.modal_content}
      data-testid="drag-drop-modal"
      ref={modalRef}
      style={{
        left: positionRef.current.x,
        top: positionRef.current.y
      }}
      onMouseDown={handleMouseDown}>
      {modalContent}
    </div>
  );

  return <>{modalContent ? createPortal(modal, document.body) : null}</>;
};

export default DragDropModal;
