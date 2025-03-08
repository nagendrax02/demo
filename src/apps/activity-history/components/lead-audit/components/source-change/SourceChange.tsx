import { CallerSource } from 'src/common/utils/rest-client';
import MetadataInfo from '../../../shared/metadata-info';
import { IComponent } from '../../lead-audit.types';
import AuditText from '../auditText';
import styles from '../styles.module.css';

const SourceChange = (props: IComponent): JSX.Element => {
  const { leadRepresentationName, auditData, changedById } = props;

  const { OldValue, NewValue, ChangedBy } = auditData || {};

  const leadRepName = leadRepresentationName?.SingularName || 'Lead';

  return (
    <>
      <div className={styles.text}>
        {leadRepName} Source Changed from <AuditText oldValue={OldValue} newValue={NewValue} />.
      </div>
      <MetadataInfo
        byLabel="Changed by:"
        createdByName={ChangedBy}
        createdBy={changedById}
        callerSource={CallerSource.ActivityHistoryLeadAuditActivity}
      />
    </>
  );
};

export default SourceChange;
