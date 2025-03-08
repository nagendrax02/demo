import { IAugmentedAHDetail } from 'apps/activity-history/types';
import styles from './opportunity-link.module.css';
import Opportunity from 'assets/custom-icon/Opportunity';
import { openOpportunityDetailsTab } from 'common/utils/helpers';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

export interface IOpportunityLink {
  data: IAugmentedAHDetail;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

const OpportunityLink = ({ data, entityDetailsCoreData }: IOpportunityLink): JSX.Element | null => {
  const { AdditionalDetails } = data;
  const isOppDetailsPage = !!entityDetailsCoreData?.entityIds?.opportunity;
  const opportunityName = AdditionalDetails?.MXEmail_OpportunityName;
  const opportunityId = AdditionalDetails?.MXEmail_ProspectOpportunityId;
  const opportunityEvent = AdditionalDetails?.MXEmail_OpportunityEventId || data?.ActivityEvent;

  const handleOpportunityClick = (): void => {
    if (opportunityEvent && opportunityId) {
      openOpportunityDetailsTab({
        entityId: opportunityId,
        eventCode: opportunityEvent
      });
    }
  };

  if (isOppDetailsPage || !opportunityId || !opportunityName) {
    return null;
  }

  return (
    <div className={styles.container} onClick={handleOpportunityClick} data-testid="opp-link">
      <Opportunity className={styles.icon} />
      <div className={styles.text}>{opportunityName}</div>
    </div>
  );
};

OpportunityLink.defaultProps = {
  entityDetailsCoreData: undefined
};

export default OpportunityLink;
