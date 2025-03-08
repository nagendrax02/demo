import { useState } from 'react';
import UserName from 'common/component-lib/user-name';
import { API_ROUTES } from 'common/constants';
import AutomationText from '../../../email/components/automation-text';
import { IComponent } from '../../lead-audit.types';
import styles from '../styles.module.css';
import { getAutomationToolTipDetails, getNewValueWithRepName } from '../utils';
import MergeLead from 'src/apps/activity-history/merge-lead/MergeLead';
import { CallerSource } from 'src/common/utils/rest-client';

const Merged = (props: IComponent): JSX.Element => {
  const [showLeadMerge, setShowLeadMerge] = useState(false);

  const {
    leadRepresentationName,
    auditData,
    auditComment,
    newValue,
    changedById = '',
    prospectAuditId = ''
  } = props;

  const { ChangedBy = '' } = auditData || {};

  const valueWithRepName = getNewValueWithRepName(newValue, leadRepresentationName);

  const getChangedBy = (): JSX.Element => {
    return (
      <span>
        by{' '}
        <UserName
          name={ChangedBy}
          id={changedById}
          callerSource={CallerSource.ActivityHistoryLeadAuditActivity}
        />
      </span>
    );
  };

  if (valueWithRepName?.includes('visitor')) {
    return (
      <div className={styles.merge_text}>
        {`Merged with ${valueWithRepName}`} {getChangedBy()}.
      </div>
    );
  }

  const getViewDetailsLink = (): JSX.Element => {
    return (
      <>
        <span
          className={styles.link}
          onClick={() => {
            setShowLeadMerge(true);
          }}>
          View Details
        </span>
        {showLeadMerge ? (
          <MergeLead
            prospectAuditId={prospectAuditId}
            show={showLeadMerge}
            setShow={setShowLeadMerge}></MergeLead>
        ) : null}
      </>
    );
  };

  if (auditComment) {
    const automationTooltipDetails = getAutomationToolTipDetails(auditComment);
    return (
      <>
        <div className={styles.merge_text}>
          <div>
            {`Merged with ${valueWithRepName} through`}{' '}
            <AutomationText
              automationToolTipDetails={automationTooltipDetails}
              leadApiUrl={API_ROUTES.AutomationName}
            />{' '}
            {getChangedBy()}.
          </div>
          <div>{getViewDetailsLink()}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.merge_text}>
        <div>
          {`Merged with ${valueWithRepName}`} {getChangedBy()}.{' '}
        </div>
        <div>{getViewDetailsLink()}</div>
      </div>
    </>
  );
};

export default Merged;
