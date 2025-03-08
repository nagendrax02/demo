import { IAdditionalDetails } from 'apps/activity-history/types';
import OpportunityIcon from '../opportunity-icon';
import styles from './opportunity.module.css';
import { getOpportunityDetailsPath } from 'src/router/utils/entity-details-url-format';

export interface IOpportunity {
  additionalDetails?: IAdditionalDetails;
  activityEvent: number;
  opportunityId?: string;
  leadId?: string;
}

const Opportunity = (props: IOpportunity): JSX.Element | null => {
  const { additionalDetails, activityEvent, opportunityId } = props;

  const { RelatedActivityId, ProspectActivityID, RelatedActivityName, RelatedActivityEvent } =
    additionalDetails || {};

  const relatedActivityId = RelatedActivityId || ProspectActivityID;
  if (!relatedActivityId) return null;

  const eventCode = RelatedActivityEvent || `${activityEvent}`;

  return (
    <>
      {!opportunityId && RelatedActivityName ? (
        <div className={styles.wrapper}>
          <OpportunityIcon className="opportunity-icon" />
          <a
            className={styles.activity_name}
            href={getOpportunityDetailsPath(relatedActivityId, eventCode)}
            target="_self">
            {RelatedActivityName}
          </a>
        </div>
      ) : null}
    </>
  );
};

Opportunity.defaultProps = {
  additionalDetails: undefined,
  leadId: undefined,
  opportunityId: undefined
};

export default Opportunity;
