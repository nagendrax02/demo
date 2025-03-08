import { DropResult } from 'react-beautiful-dnd';
import { ISortableItem } from '../sortable-list.types';

export const handleDragEnd = <T>(
  result: DropResult,
  sortableList: ISortableItem<T>[],
  onChange: (list: ISortableItem<T>[]) => void
): void => {
  if (!result?.destination) {
    return;
  }
  if (result?.source?.index === result?.destination?.index) {
    return;
  }

  const clonedList = Object.assign([], sortableList);
  const [changeItem] = clonedList.splice(result?.source?.index, 1);
  clonedList?.splice(result?.destination?.index, 0, changeItem);
  onChange(clonedList);
};
