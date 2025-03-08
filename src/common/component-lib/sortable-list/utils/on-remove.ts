import { ISortableItem } from '../sortable-list.types';

export const onRemove = <T>(
  id: string,
  sortableList: ISortableItem<T>[],
  onChange: (list: ISortableItem<T>[]) => void
): void => {
  const clonedList = [...sortableList];
  const index = sortableList.findIndex((dataItem) => dataItem.id === id);
  clonedList.splice(index, 1);
  if (onChange) onChange(clonedList);
};
