import { TabType } from 'apps/smart-views/constants/constants';
import { getDuoToneIcon, getTabIcon } from 'apps/smart-views/utils/tab-icon-mapper';
import styles from './tab-item.module.css';

interface ITabIcon {
  tabType: TabType;
  customType?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  primaryColor?: string;
}

const TabIcon = (props: ITabIcon): JSX.Element => {
  const { tabType, customType = '', isSelected, isHovered, primaryColor } = props;
  const type = tabType || TabType.Lead;

  const getDuoToneColor = (): string => {
    if (isHovered) {
      return '#1463FF';
    }
    return primaryColor ?? '#42BB24';
  };

  const getOutlineColor = (): string => {
    if (isHovered) {
      return primaryColor ?? '#1463FF';
    }
    return '#6A83A4';
  };

  const renderSelectedIcon = (): JSX.Element => {
    return (
      <div className={styles.tab_icon_container}>
        {getDuoToneIcon({ tabType: type, customType, duoToneColor: getDuoToneColor() })}
      </div>
    );
  };

  const renderUnselectedIcon = (): JSX.Element => {
    return (
      <div className={styles.tab_icon_container}>
        {getTabIcon({ tabType: type, customType, outlineColor: getOutlineColor() })}
      </div>
    );
  };

  return isSelected ? renderSelectedIcon() : renderUnselectedIcon();
};

TabIcon.defaultProps = {
  customType: ''
};

export default TabIcon;
