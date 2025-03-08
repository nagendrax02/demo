import React from 'react';
import styles from '../sortable-list.module.css';
import { classNames } from 'common/utils/helpers/helpers';
const Droppable = React.lazy(() =>
  import('react-beautiful-dnd').then((module) => ({
    default: module.Droppable
  }))
);

interface IDrag {
  children: React.ReactNode;
  customStyleClass?: string;
}
const Drop = ({ children, customStyleClass }: IDrag): JSX.Element => {
  return (
    <Droppable droppableId="droppable-id">
      {(provided) => (
        <ul
          className={classNames(styles.ul, customStyleClass)}
          {...provided.droppableProps}
          ref={provided.innerRef as React.LegacyRef<HTMLUListElement>}
          data-testid="sortable-list">
          {children}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default Drop;
