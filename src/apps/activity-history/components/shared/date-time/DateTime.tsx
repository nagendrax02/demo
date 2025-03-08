import { TimelineDateTime } from 'common/component-lib/timeline';
import { ITimeline } from '../../../types';

const DateTime = (props: ITimeline): JSX.Element | null => {
  const { ActivityDateTime } = props.data;

  return <TimelineDateTime date={ActivityDateTime || ''} />;
};

export default DateTime;
