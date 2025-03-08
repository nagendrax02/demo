import BodyWrapper from '../shared/body-wrapper';
import BodyContent from '../shared/body-content';
import ActivityScore from '../shared/activity-score';
import Opportunity from '../shared/opportunity';
import { ITimeline } from '../../types';
import { CallerSource } from 'src/common/utils/rest-client';

const Body = (props: ITimeline): JSX.Element => {
  const { data, entityDetailsCoreData } = props;

  const { ActivityScore: activityScore, CreatedByName, CreatedBy } = data.AdditionalDetails || {};

  return (
    <BodyWrapper>
      <>
        <BodyContent
          content={data.ActivityName || ''}
          byLabel="Deleted by"
          createdByName={CreatedByName}
          createdBy={CreatedBy}
          callerSource={CallerSource.ActivityHistoryDeleteLog}>
          <Opportunity
            additionalDetails={data.AdditionalDetails}
            activityEvent={data.ActivityEvent!}
            leadId={data?.LeadId}
            opportunityId={entityDetailsCoreData?.entityIds?.opportunity}
          />
        </BodyContent>
        <ActivityScore activityScore={activityScore || ''} />
      </>
    </BodyWrapper>
  );
};

export default Body;
