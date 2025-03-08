import { IAuditTrailAugmentedData } from '../../entity-audit-trail.types';
import styles from './cell-renderer.module.css';
import ViewRelatedChange from './ViewRelatedChange';

const EventLogField = ({ record }: { record: IAuditTrailAugmentedData }): JSX.Element => {
  if (record?.relatedChangeRecordConfig?.showRecord) {
    return (
      <div
        className={`${styles.event_log_field_container} ${styles.event_log_field_view_related_changes}`}>
        <ViewRelatedChange record={record} />
      </div>
    );
  }

  const value = record?.displayName ? record?.displayName : record?.schemaName;

  return (
    <div className={styles.event_log_field_container}>
      <div className={styles.event_log_field_entry} title={value}>
        {value}
      </div>
    </div>
  );
};

export default EventLogField;
