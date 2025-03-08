import { classNames } from 'common/utils/helpers';
import styles from './module-selector.module.css';
import { INavigationReferenceMap } from '../../../app-header.types';
import { MODULE_ICON_MAP } from '../../constants';

interface IModuleSelector {
  selectedModuleId: string;
  showNavMenu: boolean;
  toggleNavMenu: () => void;
  navigationReferenceMap: INavigationReferenceMap;
}

/**
 * This component is a button that displays the currently selected module and acts as a trigger for the nav menu.
 */

const ModuleSelector = ({
  selectedModuleId,
  showNavMenu,
  toggleNavMenu,
  navigationReferenceMap
}: IModuleSelector): JSX.Element => {
  const selectedModule = navigationReferenceMap?.[selectedModuleId]?.data;
  return (
    <button
      className={classNames(styles.container, showNavMenu ? styles.active : null)}
      aria-label={selectedModule?.Label}
      title={selectedModule?.Label}
      onClick={toggleNavMenu}>
      <div className={styles.icon}>{MODULE_ICON_MAP?.[selectedModule?.Id ?? '']}</div>
      <div className={classNames(styles.label, 'ng_sh_sb', 'ng_v2_style')}>
        {selectedModule?.Label}
      </div>
    </button>
  );
};

export default ModuleSelector;
