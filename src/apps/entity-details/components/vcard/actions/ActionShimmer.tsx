import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './actions.module.css';

const ActionShimmer = (): JSX.Element => {
  return (
    <div data-testid={'action-shimmer-wrapper'}>
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.more_action_shimmer} />
    </div>
  );
};

export default ActionShimmer;
