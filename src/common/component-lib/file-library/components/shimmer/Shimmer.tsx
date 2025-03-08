import BaseShimmer from '@lsq/nextgen-preact/shimmer';

const Shimmer = (): JSX.Element => {
  return (
    <>
      {Array.from({ length: 4 }).map((value) => (
        <BaseShimmer
          key={value as string}
          width="175px"
          height="160px"
          style={{ border: '1px solid rgb(var(--marvin-border-1))' }}
        />
      ))}
    </>
  );
};

export default Shimmer;
