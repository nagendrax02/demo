import Timeline from 'common/component-lib/timeline';
import { ITimeline } from '../../types';
import DateTime from '../shared/date-time';
import Body from './body';
import Icon from './Icon';

const Phone = (props: ITimeline): JSX.Element => {
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

export default Phone;
