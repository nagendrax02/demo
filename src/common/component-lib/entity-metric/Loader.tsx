import { MetricItem } from './metric-item';

const Loader = (): JSX.Element => {
  const data = { id: '120', name: 'name1', value: '9' };

  return (
    <>
      {Array(3)
        .fill(0)
        .map((index: number) => {
          return <MetricItem isLoading data={data} key={index} data-testid="loader" />;
        })}
    </>
  );
};

export default Loader;
