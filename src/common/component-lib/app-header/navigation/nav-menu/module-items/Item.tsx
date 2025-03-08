import { classNames } from 'common/utils/helpers';
import styles from './module-items.module.css';
import { INavigationItem } from '../../../app-header.types';

export interface IItemProps {
  data: INavigationItem;
  isActive: boolean;
  handleModuleItemClick: (id: string) => void;
}

/**
 * Displays a single navigation item within the selected module.
 */

const Item = ({ data, isActive, handleModuleItemClick }: IItemProps): JSX.Element => {
  const handleOnClick = (): void => {
    handleModuleItemClick(data?.Id);
  };

  return (
    <button
      className={classNames(styles.item_container, isActive ? styles.active : '')}
      title={data.Label}
      onClick={handleOnClick}>
      <div
        className={classNames(
          styles.item_label,
          'ng_sh_m',
          'ng_v2_style',
          isActive ? styles.active : ''
        )}>
        {data.Label}
      </div>
    </button>
  );
};

export default Item;
