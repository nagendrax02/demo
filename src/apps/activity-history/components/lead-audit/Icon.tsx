import { ITimeline, BgColor } from 'apps/activity-history/types';
// import { IconVariant } from 'common/component-lib/icon/icon.types';
import { ACTIVITY } from 'apps/activity-history/constants';
import StyledIcon from '../shared/styled-icon';

const Icon = (props: ITimeline): JSX.Element => {
  const {
    data: { ActivityEvent }
  } = props;

  const name = ActivityEvent === ACTIVITY.LEAD_MERGED ? 'group_add' : 'list_alt';
  const bgColor = ActivityEvent === ACTIVITY.LEAD_MERGED ? BgColor.Sky500 : BgColor.Blue500;
  // const variant = ActivityEvent === ACTIVITY.LEAD_MERGED ? IconVariant.Outlined : IconVariant.Filled

  return (
    <StyledIcon
      name={name}
      bgColor={bgColor}
      // variant={variant}
    />
  );
};

export default Icon;
