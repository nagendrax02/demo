import { IAuditTrailAugmentedData } from '../../entity-audit-trail.types';
import styles from './cell-renderer.module.css';

const NewValue = ({ record }: { record: IAuditTrailAugmentedData }): JSX.Element => {
  const value = record?.newValue ? record?.newValue : '-';
  return (
    <div className={styles.new_value_container}>
      <div className={styles.new_value_entry} title={value}>
        {value}
      </div>
    </div>
  );
};

export default NewValue;
