import Shimmer from '@lsq/nextgen-preact/shimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

interface IWithSuspense {
  suspenseFallback?: JSX.Element;
}

export function withShimmer<T>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  WrappedComponent: React.ComponentType<T & IWithSuspense>
): (props: T & IWithSuspense) => JSX.Element {
  const Component = withSuspense(WrappedComponent);
  const ComponentWithSuspense = (props): JSX.Element => {
    return <Component {...props} suspenseFallback={<Shimmer height="32px" width="100%" />} />;
  };

  return ComponentWithSuspense;
}
