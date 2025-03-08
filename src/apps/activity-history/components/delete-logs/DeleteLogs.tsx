import Timeline from 'common/component-lib/timeline';
import { ITimeline } from '../../types';
import DateTime from '../shared/date-time';
import Body from './Body';
import Icon from './Icon';

const DeleteLogs = (props: ITimeline): JSX.Element => {
  const { data, entityDetailsCoreData } = props;

  return (
    <Timeline
      timeline={{
        data: data,
        entityDetailsCoreData
      }}
      components={{
        Icon,
        DateTime,
        Body
      }}
    />
  );
};

export default DeleteLogs;
