import { classNames } from 'common/utils/helpers';
import styles from './modules.module.css';
import Pointer from './Pointer';
import { MODULE_ICON_MAP } from '../../constants';
import ProductTag from './ProductTag';
import { INavigationItem } from '../../../app-header.types';

export interface IModuleProps {
  data: INavigationItem;
  isActive: boolean;
  onModuleHover: (module: INavigationItem) => void;
  handleModuleClick: (id: string) => void;
}

/**
 * Displays a single module.
 */

const Module = ({
  data,
  isActive,
  onModuleHover,
  handleModuleClick
}: IModuleProps): JSX.Element => {
  const handleMouseEnter = (): void => {
    onModuleHover(data);
  };

  const handleOnClick = (): void => {
    handleModuleClick(data?.Id);
  };

  return (
    <button
      className={styles.module_container}
      title={data?.Label}
      onMouseEnter={handleMouseEnter}
      onClick={handleOnClick}>
      <div className={classNames(styles.wrapper, isActive ? styles.active : '')}>
        <div className={styles.module_icon}>{MODULE_ICON_MAP?.[data?.Id]}</div>
        <div className={classNames(styles.label, 'ng_sh_m', 'ng_v2_style')}>{data?.Label}</div>
        <ProductTag type={data?.Id} />
      </div>
      <Pointer />
    </button>
  );
};

export default Module;
