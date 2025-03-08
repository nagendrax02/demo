import PlatformPage from 'apps/platform';

const loadPlatformPage = (route: string): JSX.Element | null => {
  return <PlatformPage frameUrl={route}></PlatformPage>;
};

export default loadPlatformPage;
