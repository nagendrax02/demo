import Timeline from 'common/component-lib/timeline';
import { ITimeline } from '../../types';
import Body from './body';
import Icon from './Icon';
import DateTime from '../shared/date-time';

const Portal = (props: ITimeline): JSX.Element => {
  const { data } = props;

  return (
    <Timeline
      timeline={{
        data: data
      }}
      components={{
        Icon,
        DateTime,
        Body
      }}
    />
  );
};

export default Portal;
