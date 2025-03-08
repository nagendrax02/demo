import Shimmer from '@lsq/nextgen-preact/shimmer';

const AddNewTabShimmer = ({ marginBottom }: { marginBottom?: string }): JSX.Element => {
  return <Shimmer height="32px" width="100%" style={{ marginBottom: marginBottom || '' }} />;
};

AddNewTabShimmer.defaultProps = {
  marginBottom: '4px'
};

export default AddNewTabShimmer;
