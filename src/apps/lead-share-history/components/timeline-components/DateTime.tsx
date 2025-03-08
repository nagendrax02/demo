import { TimelineDateTime } from 'common/component-lib/timeline';
import { ILeadShareRecord } from '../../lead-sh.types';

interface IDateTime {
  data: ILeadShareRecord;
}

const DateTime = (props: IDateTime): JSX.Element => {
  const { data } = props;
  return (
    <div>
      <TimelineDateTime date={data?.Timestamp} />
    </div>
  );
};

export default DateTime;
