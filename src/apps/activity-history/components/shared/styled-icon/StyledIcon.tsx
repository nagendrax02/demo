import Icon from '@lsq/nextgen-preact/icon';
import { IStyledIcon } from '../../../types';
import styles from './styled-icon.module.css';

const StyledIcon = ({ name, children, bgColor, variant, dataTestId }: IStyledIcon): JSX.Element => {
  return (
    <div
      className={`${styles.icon_wrapper} ${bgColor ? styles[bgColor] : ''}`}
      data-testid={dataTestId || 'icon-wrapper'}>
      {name ? (
        <Icon name={name} customStyleClass={styles.icon} dataTestId="icon" variant={variant} />
      ) : null}
      {children}
    </div>
  );
};

export default StyledIcon;
