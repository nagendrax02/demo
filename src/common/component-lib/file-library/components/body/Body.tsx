import LeftPanel from '../left-panel';
import RightPanel from '../right-panel';
import styles from './body.module.css';

const Body = (): JSX.Element => {
  return (
    <div className={styles.body_wrapper}>
      <div className={styles.left_panel_wrapper}>
        <LeftPanel />
      </div>
      <div className={styles.right_panel_wrapper}>
        <RightPanel />
      </div>
    </div>
  );
};

export default Body;
