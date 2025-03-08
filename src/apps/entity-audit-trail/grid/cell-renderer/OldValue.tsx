import { IAuditTrailAugmentedData } from '../../entity-audit-trail.types';
import styles from './cell-renderer.module.css';

const OldValue = ({ record }: { record: IAuditTrailAugmentedData }): JSX.Element => {
  const value = record?.oldValue ? record?.oldValue : '-';
  return (
    <div className={styles.old_value_container}>
      <div className={styles.old_value_entry} title={value}>
        {value}
      </div>
    </div>
  );
};

export default OldValue;
