import Timeline from 'common/component-lib/timeline';
import { ILeadShareRecord } from '../lead-sh.types';
import DateTime from './timeline-components/DateTime';
import Icon from './timeline-components/ShareIcon';
import Body from './timeline-components/Body';
import { IEntityDetailsCoreData } from '../../entity-details/types/entity-data.types';

const LeadShareTimeline = ({
  data,
  coreData
}: {
  data: ILeadShareRecord;
  coreData: IEntityDetailsCoreData;
}): JSX.Element => {
  return (
    <>
      <Timeline
        timeline={{
          data,
          coreData
        }}
        components={{
          Body,
          Icon,
          DateTime
        }}
      />
    </>
  );
};

export default LeadShareTimeline;
