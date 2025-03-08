import { API_ROUTES } from 'common/constants';
import AutomationText from '../../../email/components/automation-text';
import MetadataInfo from '../../../shared/metadata-info';
import { IComponent } from '../../lead-audit.types';
import AuditText from '../auditText';
import styles from '../styles.module.css';
import { getAutomationToolTipDetails } from '../utils';
import { CallerSource } from 'src/common/utils/rest-client';

const StageChange = (props: IComponent): JSX.Element => {
  const { repName, auditData, auditComment, changedById } = props;

  const { OldValue, NewValue, ChangedBy } = auditData || {};

  const leadRepName = repName || 'Lead';

  let trailingHtml = auditComment ? (
    <span>
      with <span className={styles.bold}>comment</span>: {auditComment}.
    </span>
  ) : (
    '.'
  );

  if (auditComment && auditComment.includes('ActionType') && auditComment.includes('UpdateLead')) {
    const automationTooltipDetails = getAutomationToolTipDetails(auditComment);
    trailingHtml = (
      <span>
        through{' '}
        <AutomationText
          automationToolTipDetails={automationTooltipDetails}
          leadApiUrl={API_ROUTES.AutomationName}
        />
      </span>
    );
  }

  return (
    <>
      <div className={styles.text} data-testid="activity-change-stage">
        {leadRepName} Stage Changed from <AuditText oldValue={OldValue} newValue={NewValue} />{' '}
        {trailingHtml}
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

export default StageChange;
