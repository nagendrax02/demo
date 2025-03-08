import styles from './entity-metric.module.css';
import { IMetric } from './entity-metrics.types';
import { MetricItem } from './metric-item';
import Loader from './Loader';

const Metric = (props: IMetric): JSX.Element => {
  const { data, isLoading } = props;

  return (
    <div className={styles.entity_metric}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data?.map((metricInfo) => {
            return <MetricItem data={metricInfo} key={metricInfo.id} />;
          })}
        </>
      )}
    </div>
  );
};

export default Metric;
