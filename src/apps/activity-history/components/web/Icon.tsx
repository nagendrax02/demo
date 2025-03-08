import { BgColor, ITimeline } from 'apps/activity-history/types';
import { OPPORTUNITY } from 'apps/activity-history/constants';
import StyledIcon from '../shared/styled-icon';
import OpportunityIcon from '../shared/opportunity-icon';

const Icon = ({ data }: ITimeline): JSX.Element => {
  return (
    <>
      {data?.ActivityName === OPPORTUNITY ? (
        <OpportunityIcon />
      ) : (
        <StyledIcon name="language" bgColor={BgColor.Indigo500} />
      )}
    </>
  );
};

export default Icon;
