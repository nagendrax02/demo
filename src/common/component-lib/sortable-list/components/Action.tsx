import React from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../sortable-list.module.css';
import { ISortableItem } from '../sortable-list.types';

interface IAction<T> {
  sortableItem: ISortableItem<T>;
  onRemove: (id: string, item: ISortableItem<T>) => void;
}

//Need Pascal case for customAction
// eslint-disable-next-line @typescript-eslint/naming-convention
const Action = <T,>({ sortableItem, onRemove }: IAction<T>): JSX.Element => {
  const { id, isRemovable } = sortableItem;

  return (
    <div className={`${styles.action} sortable-list-item-action sortable-list-close-action`}>
      {isRemovable && onRemove ? (
        <button
          className={styles.close_button}
          onClick={(): void => {
            onRemove(id, sortableItem);
          }}
          data-testid={`${id}-close`}>
          <Icon name="close" customStyleClass={`close-icon ${styles.close} `} />
        </button>
      ) : null}
    </div>
  );
};

Action.defaultProps = {
  isRemovable: undefined,
  onRemove: undefined,
  CustomAction: null
};

export default Action;
