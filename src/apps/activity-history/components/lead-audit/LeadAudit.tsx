import Timeline from 'common/component-lib/timeline';
import { ITimeline } from 'apps/activity-history/types';
import DateTime from '../shared/date-time';
import Body from './Body';
import Icon from './Icon';

const LeadAudit = (props: ITimeline): JSX.Element => {
  const { data, leadRepresentationName, type, entityDetailsCoreData } = props;

  return (
    <Timeline
      timeline={{
        data,
        leadRepresentationName,
        type,
        entityDetailsCoreData
      }}
      components={{
        DateTime,
        Icon,
        Body
      }}
    />
  );
};

export default LeadAudit;
