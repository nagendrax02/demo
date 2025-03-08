import Shimmer from '@lsq/nextgen-preact/shimmer';

const ManageTabShimmer = (): JSX.Element => {
  return (
    <>
      {Array.from({ length: 7 }, (item: number) => {
        return <Shimmer key={item} height="32px" width="100%" style={{ marginBottom: '8px' }} />;
      })}
    </>
  );
};

export default ManageTabShimmer;
