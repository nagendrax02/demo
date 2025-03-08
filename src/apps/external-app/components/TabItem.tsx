import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import IconHandler from './IconHandler';
import styles from '../external-app.module.css';

interface ITabItem {
  menuItem: IExternalNavItem;
  isActive: boolean;
  onClick: (menuItem: IExternalNavItem) => void;
}

const TabItem = (props: ITabItem): JSX.Element => {
  const { menuItem, isActive, onClick } = props;

  const handleOnClick = (): void => {
    onClick(menuItem);
  };

  return (
    <div
      className={`${styles.nav_item_container} ${isActive ? styles.nav_item_active : ''}`}
      onClick={handleOnClick}>
      {menuItem?.isIconHidden ? (
        <IconHandler iconURL={menuItem?.IconURL} isActive={isActive} />
      ) : null}
      <div className={`${styles.nav_item_text} ${isActive ? styles.nav_item_text_active : ''}`}>
        {menuItem?.Text}
      </div>
    </div>
  );
};

export default TabItem;
