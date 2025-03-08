import styles from '../sortable-list.module.css';
import Action from './Action';
import { ISortableItem } from '../sortable-list.types';
import Icon from '@lsq/nextgen-preact/icon';
import Badge from './Badge';
import Pin from './Pin';
import { classNames } from 'common/utils/helpers/helpers';

interface IContent<T> {
  sortableItem: ISortableItem<T>;
  onRemove?: (id: string, item: ISortableItem<T>) => Promise<void>;
  onPin?: (item: ISortableItem<T>, isPinned: boolean) => void;
}

const Content = <T,>({ sortableItem, onRemove, onPin }: IContent<T>): JSX.Element => {
  const { id, label, badgeText, isDraggable = true } = sortableItem;

  return (
    <div className={classNames(styles.content_wrapper, sortableItem?.customStyleClass)} key={id}>
      <div className={styles.center}>
        {isDraggable ? (
          <Icon name="drag_indicator" customStyleClass={`${styles.drag_indicator}`} />
        ) : null}
        <span
          className={`${styles.title} ng_sh_sb ng_v2_style`}
          title={typeof label === 'string' ? label : ''}>
          {label}
        </span>
      </div>
      <div className={styles.action_wrapper}>
        <Badge badgeText={badgeText} />
        <Pin sortableItem={sortableItem} onPin={onPin} />
        <Action sortableItem={sortableItem} onRemove={onRemove} />
      </div>
    </div>
  );
};

Content.defaultProps = {
  isRemovable: undefined,
  onRemove: undefined,
  onPin: undefined
};

export default Content;
