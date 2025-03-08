import Shimmer from '@lsq/nextgen-preact/shimmer';
import { isMobileDevice } from 'common/utils/helpers';

interface IActionShimmer {
  actionCount?: number;
}

const ActionShimmer = ({ actionCount }: IActionShimmer): JSX.Element => {
  const shimmers = actionCount ? actionCount : isMobileDevice() ? 2 : 3;

  return (
    <>
      {Array.from(Array(shimmers).keys()).map((item) => (
        <Shimmer key={item} width="20px" height="24px" />
      ))}
    </>
  );
};

export default ActionShimmer;
