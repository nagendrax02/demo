import { ITimeline } from '../../types';
import BodyWrapper from '../shared/body-wrapper';

const Body = (props: ITimeline): JSX.Element => {
  const { data } = props;

  return (
    <BodyWrapper>
      <span>
        Default {data.ActivityName}:{data.ActivityEvent}
      </span>
    </BodyWrapper>
  );
};

export default Body;
