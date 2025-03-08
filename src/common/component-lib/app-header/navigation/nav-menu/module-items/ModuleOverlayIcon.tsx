import { INavigationItem } from '../../../app-header.types';
import { MODULE_ICON_MAP } from '../../constants';
import styles from './module-items.module.css';

interface IModuleOverlayIconProps {
  data?: INavigationItem;
}

/**
 * Overlays the selected module icon on the bottom of the nav menu.
 */

const ModuleOverlayIcon = ({ data }: IModuleOverlayIconProps): JSX.Element => {
  return <div className={styles.module_icon_overlay}>{MODULE_ICON_MAP?.[data?.Id ?? '']}</div>;
};

export default ModuleOverlayIcon;
