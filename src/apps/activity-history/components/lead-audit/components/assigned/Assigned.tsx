import { API_ROUTES } from 'common/constants';
import AutomationText from '../../../email/components/automation-text';
import MetadataInfo from '../../../shared/metadata-info';
import { IComponent } from '../../lead-audit.types';
import AuditText from '../auditText';
import styles from '../styles.module.css';
import { getAssignedRepName, getAutomationToolTipDetails } from '../utils';
import { CallerSource } from 'src/common/utils/rest-client';

const Assigned = (props: IComponent): JSX.Element => {
  const {
    leadRepresentationName,
    auditData,
    auditComment,
    changedById,
    entityDetailsCoreData,
    type
  } = props;

  const { OldValue, NewValue, ChangedBy } = auditData || {};

  const leadRepName = getAssignedRepName(leadRepresentationName, entityDetailsCoreData, type);

  const automationTooltipDetails = auditComment
    ? getAutomationToolTipDetails(auditComment)
    : undefined;

  const textContent = (
    <>
      {leadRepName} Owner Changed from <AuditText oldValue={OldValue} newValue={NewValue} />{' '}
      {auditComment ? 'through' : ''}
    </>
  );

  const automationTextComponent = auditComment ? (
    <AutomationText
      automationToolTipDetails={automationTooltipDetails}
      leadApiUrl={API_ROUTES.AutomationName}
    />
  ) : null;

  return (
    <>
      <div className={styles.text} data-testid="activity-assigned">
        {textContent} {automationTextComponent}
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

export default Assigned;
