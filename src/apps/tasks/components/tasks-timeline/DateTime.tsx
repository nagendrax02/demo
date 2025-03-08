import { TimelineDateTime } from 'common/component-lib/timeline';
import { ITaskItem } from '../../tasks.types';

interface IDateTime {
  data: ITaskItem;
}

const DateTime = (props: IDateTime): JSX.Element => {
  const { data } = props;

  return (
    <div>
      <TimelineDateTime date={data?.DateString} />
    </div>
  );
};

export default DateTime;
