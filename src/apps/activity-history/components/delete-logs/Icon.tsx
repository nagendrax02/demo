import { ITimeline, BgColor } from '../../types';
import { ACTIVITY } from '../../constants';
import StyledIcon from '../shared/styled-icon';

const Icon = (props: ITimeline): JSX.Element => {
  const { ActivityEvent } = props.data;

  return (
    <StyledIcon
      name="list_alt"
      bgColor={
        ActivityEvent === ACTIVITY.OPPORTUNITY_DELETE_LOG ? BgColor.Purple500 : BgColor.Blue500
      }
    />
  );
};

export default Icon;
