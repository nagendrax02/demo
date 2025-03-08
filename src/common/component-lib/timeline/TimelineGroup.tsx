import NextGenTimelineGroup from '@lsq/nextgen-preact/timeline/timeline-group';
import { ITimelineGroup } from '@lsq/nextgen-preact/timeline/timeline-group/timeline-group.types';
import { getCurrentUserTimeZone } from 'common/utils/helpers/helpers';

const TimelineGroup = <T extends object>(
  props: Omit<ITimelineGroup<T>, 'timeZone'>
): JSX.Element => {
  return <NextGenTimelineGroup {...props} timeZone={getCurrentUserTimeZone()} />;
};

export default TimelineGroup;
