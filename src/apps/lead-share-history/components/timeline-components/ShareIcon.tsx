import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from '../../lead-sh.module.css';

const ShareIcon = (): JSX.Element => {
  return (
    <Icon name={'share'} variant={IconVariant.Filled} customStyleClass={styles.timeline_icon} />
  );
};

export default ShareIcon;
