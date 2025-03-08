import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import styles from '../../lead-sh.module.css';
import { keys, accessMap } from '../../constants';
import { EntityShareStatus, ILeadShareRecord } from '../../lead-sh.types';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import LeadShareDetails from './LeadShareDetails';
import ActivityDetailsModal from 'common/component-lib/modal/activity-details-modal';
import { useState } from 'react';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { EntityType } from 'common/types/entity.types';

interface IBody {
  data: ILeadShareRecord;
  coreData: IEntityDetailsCoreData;
}

const Body = (props: IBody): JSX.Element => {
  const { data, coreData } = props;
  const { entityIds } = coreData;
  const leadRepName = useLeadRepName();
  const [accHeading, setAccHeading] = useState('View Details');
  const [activityId, setActivityId] = useState('');

  const shareText = (): JSX.Element => {
    const text = `${
      coreData?.entityDetailsType === EntityType.Opportunity
        ? coreData?.entityRepNames?.opportunity?.SingularName
        : leadRepName.SingularName
    } ${data.RequestType === keys.Share ? 'Shared with' : 'Access with'}`;
    let actionText = '';
    if (data.RequestType === keys.Share) {
      actionText += `${data.UserName ? 'with' : ''} ${
        accessMap[data.EntityShareAccessType] || ''
      } access.`;
    } else {
      actionText += 'is revoked.';
    }
    return (
      <>
        {text} {`${data.UserName || data.UserId} `}
        {actionText}
      </>
    );
  };
  let failedState = false;

  const validationMsg = (): JSX.Element => {
    switch (data.EntityShareStatus) {
      case EntityShareStatus.RequestProcessedSuccessfully:
      case EntityShareStatus.RequestNotProcessingSimilarRequestExists:
      case EntityShareStatus.StatusUnavailable:
        return <></>;
      case EntityShareStatus.RequestProcessedButFailed:
      case EntityShareStatus.RequestProcessingFailedValidationFailure:
        failedState = true;
        return (
          <span className={styles.failed_msg}>
            <div className={styles.bullet} />
            Failed
          </span>
        );
      default:
        return (
          <span className={styles.processing_msg}>
            <div className={styles.bullet} />
            Processing
          </span>
        );
    }
  };

  const handleShow = (show): void => {
    setAccHeading(show ? 'Hide Details' : 'View Details');
  };

  return (
    <div className={styles.lead_share_body}>
      <span>
        {shareText()}
        {validationMsg()}
      </span>
      <Accordion
        name={accHeading}
        handleShow={handleShow}
        arrowRotate={{
          angle: ArrowRotateAngle.Deg90,
          direction: ArrowRotateDirection.ClockWise
        }}
        defaultState={DefaultState.CLOSE}>
        <LeadShareDetails data={data} failedState={failedState} setActivityId={setActivityId} />
      </Accordion>
      <ActivityDetailsModal
        renderNotes
        activityId={activityId}
        leadId={entityIds?.lead}
        entityId={entityIds?.opportunity}
        close={() => {
          setActivityId('');
        }}
        callerSource={CallerSource.LeadShareHistory}
      />
    </div>
  );
};

export default Body;
