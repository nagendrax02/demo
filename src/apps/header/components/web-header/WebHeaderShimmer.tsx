import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './web-header.module.css';

const WebHeaderShimmer = (): JSX.Element => {
  return (
    <div className={styles.shimmer_container}>
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
      <Shimmer className={styles.shimmer} />
    </div>
  );
};

export default WebHeaderShimmer;
