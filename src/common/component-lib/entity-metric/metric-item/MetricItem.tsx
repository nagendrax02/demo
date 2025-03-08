import Shimmer from '@lsq/nextgen-preact/shimmer';
import { IMetricDetail } from '../entity-metrics.types';
import styles from './metric-item.module.css';

interface IMetricItem {
  data: IMetricDetail;
  isLoading?: boolean;
}

const MetricItem = (props: IMetricItem): JSX.Element => {
  const { data, isLoading } = props;

  return (
    <div className={`${styles.metric_wrapper}`} tabIndex={0}>
      {isLoading ? (
        <Shimmer className={styles.shimmer} height="20px" width="100%" dataTestId="shimmer" />
      ) : (
        <span className={styles.metric_name}>{data.name ? data.name : '-'}</span>
      )}

      {isLoading ? (
        <Shimmer height="20px" width="100%" dataTestId="shimmer" />
      ) : (
        <span className={styles.metric_value} aria-label={`${data.value || 'none'}`}>
          {data.value ? data.value : '-'}
        </span>
      )}
    </div>
  );
};

MetricItem.defaultProps = {
  isLoading: false
};

export default MetricItem;
