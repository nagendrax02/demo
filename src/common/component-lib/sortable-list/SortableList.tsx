import { trackError } from 'common/utils/experience/utils/track-error';
import React from 'react';
import { useCallback } from 'react';
import { ISortableItem, ISortableListProps } from './sortable-list.types';
import Drop from './components/Drop';
import Drag from './components/Drag';
import Content from './components/Content';

const DragDropContext = React.lazy(() =>
  import('react-beautiful-dnd').then((module) => ({
    default: module.DragDropContext
  }))
);

const SortableList = <T,>(props: ISortableListProps<T>): JSX.Element => {
  const { sortableList, onChange, onRemove, onPin, customStyleClass } = props;

  const handleDragEnd = useCallback(
    async (result): Promise<void> => {
      try {
        const module = await import('./utils/on-drag-end');
        module.handleDragEnd(result, sortableList, onChange);
      } catch (error) {
        trackError(error);
      }
    },
    [sortableList, onChange]
  );

  const onRemoveItem = async (id: string, item: ISortableItem<T>): Promise<void> => {
    try {
      const module = await import('./utils/on-remove');
      const removeItem = (): void => {
        module.onRemove(id, sortableList, onChange);
      };
      if (onRemove) {
        onRemove(id, removeItem, item);
        return;
      }
      removeItem();
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Drop customStyleClass={customStyleClass}>
        {sortableList?.map((item, index) => {
          return (
            <>
              {item?.isHidden ? null : (
                <Drag
                  id={item.id}
                  isDraggable={item.isDraggable ?? true}
                  index={index}
                  key={item.id}>
                  <Content sortableItem={item} onRemove={onRemoveItem} onPin={onPin} />
                </Drag>
              )}
            </>
          );
        })}
      </Drop>
    </DragDropContext>
  );
};

export default SortableList;
