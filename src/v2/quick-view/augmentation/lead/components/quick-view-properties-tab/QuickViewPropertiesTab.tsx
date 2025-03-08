import React from 'react';
import QuickViewMetrics from '../quick-view-metrics/QuickViewMetrics';
import { IMetricsConfig } from 'common/component-lib/global-search-v2/global-searchV2.types';
import styles from './quick-view-properties.module.css';
import { classNames } from 'common/utils/helpers/helpers';
interface IQuickViewPropertiesTabProps {
  properties: React.ReactNode | React.ReactNode[];
  metricData?: IMetricsConfig[];
}

const QuickViewPropertiesTab: React.FC<IQuickViewPropertiesTabProps> = ({
  properties,
  metricData
}) => {
  return (
    <div className={classNames(styles.properties, 'ng_v2_style')}>
      <div className={styles.tab_content}>
        {(metricData ?? []).length > 0 ? <QuickViewMetrics metricData={metricData ?? []} /> : null}
        {Array.isArray(properties) ? properties.map((property) => property) : properties}
      </div>
    </div>
  );
};

export default QuickViewPropertiesTab;
