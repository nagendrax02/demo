import { IAuditData } from 'apps/activity-history/types';
import MetadataInfo from '../../../shared/metadata-info';
import styles from '../styles.module.css';
import { CallerSource } from 'src/common/utils/rest-client';

interface IAssigned {
  auditData: IAuditData | undefined;
  fieldDisplayName: string | undefined;
  changedById: string | undefined;
}

const Assigned = (props: IAssigned): JSX.Element => {
  const { auditData, fieldDisplayName, changedById = '' } = props;

  const { OldValue, NewValue, ChangedBy = '' } = auditData || {};

  return (
    <div data-testid="assigned">
      <div className={styles.text}>
        {fieldDisplayName}
        {' changed from '}
        <div className={styles.bold}>{OldValue}</div>
        {' to '}
        <div className={styles.bold}>{NewValue}</div>
      </div>
      <MetadataInfo
        byLabel="Changed by"
        createdByName={ChangedBy}
        createdBy={changedById}
        callerSource={CallerSource.ActivityHistoryOppAuditActivity}
      />
    </div>
  );
};

export default Assigned;
