import { ITimeline } from 'apps/activity-history/types';
import Timeline from 'common/component-lib/timeline';
import DateTime from '../shared/date-time';
import Body from './Body';
import Icon from './Icon';

const OpportunityActivity = (props: ITimeline): JSX.Element => {
  const { data, leadRepresentationName, entityDetailsCoreData } = props;

  const { ActivityEvent } = data || {};

  const GetIcon = (): JSX.Element => {
    return <Icon activityEvent={ActivityEvent} />;
  };

  return (
    <Timeline
      timeline={{
        data,
        leadRepresentationName,
        entityDetailsCoreData
      }}
      components={{
        Icon: GetIcon,
        DateTime,
        Body
      }}
    />
  );
};

export default OpportunityActivity;
