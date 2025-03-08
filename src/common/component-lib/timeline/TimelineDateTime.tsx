import NextGenTimelineDateTime from '@lsq/nextgen-preact/timeline/timeline-date-time';
import { getCurrentUserTimeZone } from 'common/utils/helpers/helpers';

const TimelineDateTime = (props: { date: string }): JSX.Element => {
  return <NextGenTimelineDateTime {...props} timeZone={getCurrentUserTimeZone()} />;
};

export default TimelineDateTime;
