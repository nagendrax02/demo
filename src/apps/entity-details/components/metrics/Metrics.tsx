import Metric from 'common/component-lib/entity-metric';
import useEntityDetailStore from '../../entitydetail.store';

const Metrics = (): JSX.Element => {
  const isLoading = useEntityDetailStore((state) => state.isLoading);
  const augmentedEntityData = useEntityDetailStore((state) => state.augmentedEntityData?.metrics);

  return (
    <>
      {!isLoading && !augmentedEntityData ? (
        <></>
      ) : (
        <Metric data={augmentedEntityData || []} isLoading={isLoading} />
      )}
    </>
  );
};

export default Metrics;
