import { TimelineDateTime } from 'common/component-lib/timeline';
import { INotesItem } from '../../notes.types';

interface IDateTime {
  data: INotesItem;
}

const DateTime = (props: IDateTime): JSX.Element => {
  const { data } = props;

  return (
    <div>
      <TimelineDateTime date={data?.CreatedOn} />
    </div>
  );
};

export default DateTime;
