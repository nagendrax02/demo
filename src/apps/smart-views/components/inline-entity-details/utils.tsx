import styles from './inline-entity-details.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';

export const getShimmerFields = (count?: number): JSX.Element[] => {
  const fields: JSX.Element[] = [];
  for (let i = 0; i < (count || 10); i++) {
    fields.push(
      <div className={styles.field} key={1}>
        <div className={styles.field_name}>
          <Shimmer height="100%" width="100%" />
        </div>
        <div className={styles.field_value}>
          <Shimmer height="100%" width="100%" />
        </div>
      </div>
    );
  }
  return fields;
};
