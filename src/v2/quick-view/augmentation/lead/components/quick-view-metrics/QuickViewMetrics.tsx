import React from 'react';
import styles from './quick-view-metrics.module.css';
import { IMetricsConfig } from 'common/component-lib/global-search-v2/global-searchV2.types';
import { classNames } from 'common/utils/helpers/helpers';

interface IQuickViewMetricsProps {
  metricData: IMetricsConfig[];
}

const QuickViewMetrics: React.FC<IQuickViewMetricsProps> = ({ metricData }) => {
  return (
    <div className={styles.metrics}>
      <div className={styles.metrics_grid}>
        {metricData?.map((metric: IMetricsConfig) => (
          <div key={metric.id} className={styles.metric_item}>
            <span className={classNames(styles.metric_value, 'ng_h_4_r')}>
              {metric?.value ? metric.value : '-'}
            </span>
            <span className={classNames(styles.metric_label, 'ng_p_2_r')}>
              {metric?.name ? metric.name : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickViewMetrics;
