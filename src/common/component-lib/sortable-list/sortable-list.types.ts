import { IColumnConfigData } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface IPinActionConfig {
  showPinAction?: boolean;
  isPinned?: boolean;
  canUnpin?: boolean;
  schemaName?: string;
  hasReachedMaxPinnedLimit?: boolean;
}

interface ISortableItem<T> {
  id: string;
  label: string | JSX.Element;
  isRemovable?: boolean;
  isDraggable?: boolean;
  isHidden?: boolean;
  isActive?: boolean;
  config?: T;
  badgeText?: string;
  columnConfigData?: IColumnConfigData;
  customStyleClass?: string;
}

interface ISortableListProps<T> {
  sortableList: ISortableItem<T>[];
  onChange: (sortedList: ISortableItem<T>[]) => void;
  onRemove?: (id: string, removeCallback: () => void, removedItem: ISortableItem<T>) => void;
  onPin?: (item: ISortableItem<T>, isPinned: boolean) => void;
  customStyleClass?: string;
}

interface IListItem<T> {
  sortableItem: ISortableItem<T>;
  index: number;
}

export type { ISortableItem, ISortableListProps, IListItem };
