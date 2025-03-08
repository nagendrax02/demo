import DateTime from 'common/component-lib/entity-fields/date-time';
import { DateRenderType } from 'apps/entity-details/types/entity-data.types';
import { AuditTrailEventType, IAuditTrailAugmentedData } from '../../entity-audit-trail.types';
import styles from './cell-renderer.module.css';

const ModifiedOn = ({ record }: { record: IAuditTrailAugmentedData }): JSX.Element => {
  return (
    <div className={styles.modified_on_container}>
      <DateTime
        date={record?.modifiedOn}
        renderType={DateRenderType.Datetime}
        timeFormat="hh:mm a"
      />
      <div>
        <span className={styles.modified_by_user_name} title={record?.modifiedByUserName}>
          <span className={styles.modified_by}>By: </span>
          {record?.modifiedByUserName}
        </span>
      </div>
      <div className={styles.modified_on_lead_created}>
        {record?.eventType === AuditTrailEventType?.LeadCreated ? 'Lead Created' : null}
      </div>
    </div>
  );
};

export default ModifiedOn;
