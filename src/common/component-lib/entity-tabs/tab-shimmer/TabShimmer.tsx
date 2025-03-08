import Shimmer from '@lsq/nextgen-preact/shimmer';
import { isMobileDevice } from 'common/utils/helpers';

const TabShimmer = (): JSX.Element => {
  const shimmers = isMobileDevice() ? 3 : 5;
  return (
    <>
      {Array.from(Array(shimmers).keys()).map((item) => (
        <Shimmer
          key={item}
          width="25%"
          height="24px"
          style={{ marginTop: '12px', marginInline: '10px' }}
        />
      ))}
    </>
  );
};

export default TabShimmer;
