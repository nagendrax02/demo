import Icon from '@lsq/nextgen-preact/icon';
import styles from './tab-actions.module.css';
import { useState } from 'react';
import useEntityTabsStore from '../store';

const Refresh = (): JSX.Element => {
  const [animate, setAnimate] = useState(false);
  const { setRefreshTab } = useEntityTabsStore();

  const handleTabRefresh = (): void => {
    setAnimate(true);
    setRefreshTab();
    setTimeout(() => {
      setAnimate(false);
    }, 500);
  };

  return (
    <span onClick={handleTabRefresh} className={styles.refresh_container}>
      <Icon
        name="refresh"
        customStyleClass={`${styles.color_quaternary} ${styles.refresh_icon} ${
          animate ? styles.animate : ''
        }`}
      />
    </span>
  );
};

export default Refresh;
