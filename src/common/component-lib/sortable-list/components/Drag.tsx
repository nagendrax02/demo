import React from 'react';
import styles from '../sortable-list.module.css';

const Draggable = React.lazy(() =>
  import('react-beautiful-dnd').then((module) => ({
    default: module.Draggable
  }))
);

interface IDrag {
  id: string;
  isDraggable: boolean;
  index: number;
  children: React.ReactNode;
}
const Drag = ({ id, isDraggable, index, children }: IDrag): JSX.Element => {
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={!isDraggable}>
      {(provided, snapshot) => {
        const style = {
          backgroundColor: snapshot?.isDragging
            ? 'rgb(var(--marvin-background-2))'
            : 'rgb(var(--marvin-base))',

          ...provided.draggableProps.style
        } as React.CSSProperties;

        return (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef as React.LegacyRef<HTMLLIElement>}
            style={style}
            data-testid={id}
            className={`${styles.li} sortable-list-item`}
            role="listitem">
            {children}
          </li>
        );
      }}
    </Draggable>
  );
};

export default Drag;
