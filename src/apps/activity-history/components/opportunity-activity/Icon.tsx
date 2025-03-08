import { ACTIVITY } from 'apps/activity-history/constants';
import { BgColor } from 'apps/activity-history/types';
import StyledIcon from '../shared/styled-icon';

const Icon = ({ activityEvent }: { activityEvent: number | undefined }): JSX.Element => {
  const name = activityEvent === ACTIVITY.OPPORTUNITY_CAPTURE ? 'fullscreen' : 'timeline';

  const bgColor =
    activityEvent === ACTIVITY.OPPORTUNITY_CAPTURE ? BgColor.Blue700 : BgColor.Blue500;

  return <StyledIcon name={name} bgColor={bgColor} />;
};

export default Icon;
