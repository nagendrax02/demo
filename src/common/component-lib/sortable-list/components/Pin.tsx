import { classNames } from 'common/utils/helpers/helpers';
import styles from '../sortable-list.module.css';
import PinIcon from 'assets/custom-icon/Pin';
import { ISortableItem } from '../sortable-list.types';
import TooltipWrapper from 'apps/smart-views/components/smartview-tab/components/tab-settings/available-fields/TooltipWrapper';
import { getPinActionTooltipMessage } from './utils';

interface IPin<T> {
  sortableItem: ISortableItem<T>;
  onPin?: (item: ISortableItem<T>, pinned: boolean) => void;
}

const Pin = <T,>(props: IPin<T>): JSX.Element | null => {
  const { sortableItem, onPin } = props;
  const { pinnedColumnConfig } = sortableItem.columnConfigData || {};
  const {
    showPinAction = false,
    isPinned = false,
    canUnpin = true,
    hasReachedMaxPinnedLimit = false
  } = pinnedColumnConfig || {};

  const getIconStyleClass = (): string => {
    if (!canUnpin) {
      return styles.disabled;
    }
    if (hasReachedMaxPinnedLimit) {
      return styles.max_limit_reached;
    }
    return isPinned ? styles.pinned : styles.unpinned;
  };

  const handleOnPin = (): void => {
    if (onPin && canUnpin) {
      onPin(sortableItem, !isPinned);
    }
  };

  const iconStyles = classNames(styles.pin_base_icon, getIconStyleClass());

  const isDisabled = !canUnpin || hasReachedMaxPinnedLimit;

  if (showPinAction) {
    return (
      <button
        className={styles.pin_base_button}
        onClick={handleOnPin}
        disabled={isDisabled}
        data-testid={isPinned ? 'pinned' : 'unpinned'}>
        <TooltipWrapper
          key={sortableItem?.id}
          message={getPinActionTooltipMessage(canUnpin, hasReachedMaxPinnedLimit)}
          showTooltip={isDisabled}>
          <PinIcon className={iconStyles} type={isPinned ? 'filled' : 'outline'} />
        </TooltipWrapper>
      </button>
    );
  }

  return null;
};

Pin.defaultProps = {
  onPin: undefined
};

export default Pin;
