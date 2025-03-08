import { useLocation } from 'wouter';
import { useSearch } from 'wouter/use-location';
import { routerConfig } from './router-config';
import { useExternalAppListener } from 'apps/external-app';
import loadExternalApp from './load-external-app';
import loadPlatformPage from './load-platform-pages';
import { CallerSource } from 'common/utils/rest-client';
import { useFeatureRestriction } from 'common/utils/feature-restriction';
import { useEffect } from 'react';
import { addGlobalObjectForExternalApps } from './utils';
import { isMiP } from 'common/utils/helpers';
import { publishExternalAppEvent } from 'apps/external-app/event-handler';
import useHeaderStore from 'apps/header/header.store';
import { InMemoryStorageKey } from 'common/utils/storage-manager';
import useIdleUser from 'common/utils/authentication/hooks/useIdleUserSessionTimeout';
import { isAppTabsEnabled } from 'common/component-lib/mip-navigation/utils';
import { getRoute } from './utils/helper';
import useAppTabsEnabled from 'common/utils/use-app-tabs-enabled';

const Router = (): JSX.Element => {
  const [loc, setLocation] = useLocation();
  window[InMemoryStorageKey.SetLocation] = setLocation;
  useIdleUser();

  const searchQuery = useSearch();
  const { setOnRenderRegistration } = useHeaderStore((state) => ({
    setOnRenderRegistration: state.setOnRenderRegistration
  }));

  const { setIsAppTabsEnabled } = useAppTabsEnabled();

  useEffect(() => {
    if (!isMiP()) addGlobalObjectForExternalApps(setOnRenderRegistration);
    (async (): Promise<void> => {
      setIsAppTabsEnabled(await isAppTabsEnabled());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useExternalAppListener();
  useFeatureRestriction(CallerSource.NA);

  const routeLocation = getRoute(loc);

  const getRouteFromRouterConfig = (): JSX.Element | undefined => {
    publishExternalAppEvent('lsq-marvin-external-app-load', {
      data: {
        url: routeLocation
      }
    });
    return routerConfig[routeLocation]?.(searchQuery, loc);
  };

  return (
    <>
      {routerConfig[routeLocation]
        ? getRouteFromRouterConfig()
        : loadExternalApp(loc) ||
          loadPlatformPage(loc + searchQuery) || <h3>This page does not exist</h3>}
    </>
  );
};

export default Router;
