import Timeline from 'common/component-lib/timeline';
import { ITimeline } from 'apps/activity-history/types';
import Body from './body';
import Icon from './Icon';
import DateTime from '../shared/date-time';

const WebActivities = (props: ITimeline): JSX.Element => {
  const { data, leadRepresentationName } = props;

  return (
    <Timeline
      timeline={{
        data,
        leadRepresentationName
      }}
      components={{
        Icon,
        Body,
        DateTime
      }}
    />
  );
};

export default WebActivities;
