import { trackError } from 'common/utils/experience/utils/track-error';
import { IModuleConfig } from 'common/types/authentication.types';
import IFrame from 'common/component-lib/iframe';
import { safeParseJson } from 'common/utils/helpers';
import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { useEffect, useState } from 'react';
import { publishExternalAppEvent, subscribeExternalAppEvent } from '../event-handler';
import { useLocation } from 'wouter';

const ExternalAppLoader = ({
  appConfig,
  selectedSubMenuItem
}: {
  appConfig: IModuleConfig;
  selectedSubMenuItem?: IExternalNavItem;
}): JSX.Element => {
  const [mailmergedURLData, setMailMergedURLData] = useState<Record<string, string>>();
  const [showSpinner, setShowSpinner] = useState(true);
  const [, setLocation] = useLocation();

  const src = appConfig?.AppURL || appConfig?.RouteConfig?.BaseURL || '';
  const iframeAttributes = safeParseJson(appConfig?.ExternalAppConfig?.Attributes || '') as Record<
    string,
    string
  >;
  const inlineStyle = safeParseJson(appConfig?.ExternalAppConfig?.InlineStyleJSON || '') as Record<
    string,
    string
  >;

  const handleMailMerge = async (mailMergeId: string, urlToMailMerge: string): Promise<void> => {
    if (!urlToMailMerge) return;
    try {
      const response = (await httpPost({
        path: API_ROUTES.mailMergedContent,
        module: Module.Connector,
        body: {
          data: urlToMailMerge
        },
        callerSource: CallerSource.ExternalApp
      })) as string;

      setMailMergedURLData({ ...mailmergedURLData, [mailMergeId]: response?.replaceAll('"', '') });
    } catch (error) {
      trackError(error);
    }
  };

  const addSearchParams = (url: string, key: string, value: string): string => {
    try {
      if (!url) return '';

      const urlObj = new URL(url);
      urlObj.searchParams.append(key, value);
      const stringifiedUrl = urlObj.toString();
      const searchTextFromUrl = window?.location?.search;
      if (searchTextFromUrl && !stringifiedUrl?.includes(searchTextFromUrl))
        return `${stringifiedUrl}${searchTextFromUrl}`;
      return stringifiedUrl;
    } catch (error) {
      trackError(error);
      return '';
    }
  };

  useEffect(() => {
    subscribeExternalAppEvent('update-active-url', (data: Record<string, string>) => {
      if (data?.route) {
        const updatedRoute = `${appConfig?.RouteConfig?.RoutePath}${data?.route}`;
        setLocation(updatedRoute);
      }
    });
  }, []);

  useEffect(() => {
    if (!showSpinner) {
      publishExternalAppEvent('lsq-marvin-external-app-load', {
        data: {
          url: addSearchParams(src, 'appName', appConfig.Name)
        }
      });
    }
  }, [appConfig.Name, src, showSpinner]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (selectedSubMenuItem && !mailmergedURLData?.[selectedSubMenuItem?.Id]) {
        await handleMailMerge(selectedSubMenuItem.Id, selectedSubMenuItem.AppURL);
      }
    })();
  }, [selectedSubMenuItem]);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!appConfig?.ChildConfig?.IsDynamic && !mailmergedURLData?.[`${appConfig.Id}`]) {
        await handleMailMerge(`${appConfig.Id}`, appConfig.AppURL || '');
      }
    })();
  }, [appConfig?.AppURL]);

  const getInternalRoute = (): string => {
    const { pathname } = location;
    let trimmedPath = pathname?.replace(appConfig?.RouteConfig?.RoutePath || '', '') || '';
    if (trimmedPath.slice(-1) === '/') {
      trimmedPath = trimmedPath.slice(0, -1);
    }
    return trimmedPath;
  };

  const getIFrameURLToLoad = (): string => {
    let mailMergedUrl: string = '';
    const internalRoute = getInternalRoute();
    if (!mailmergedURLData) return addSearchParams(src, 'appName', appConfig.Name);

    if (appConfig.ChildConfig?.IsDynamic && selectedSubMenuItem) {
      mailMergedUrl = mailmergedURLData[selectedSubMenuItem?.Id];
    } else {
      mailMergedUrl = mailmergedURLData[appConfig.Id];
    }
    if (internalRoute) {
      mailMergedUrl += internalRoute;
    }

    return addSearchParams(mailMergedUrl, 'appName', appConfig.Name);
  };

  const mailMergedUrl = getIFrameURLToLoad();

  return (
    <IFrame
      id={appConfig?.Name}
      src={mailMergedUrl}
      attributes={iframeAttributes}
      inlineStyle={inlineStyle}
      showSpinner={showSpinner}
      setShowSpinner={setShowSpinner}
    />
  );
};

export default ExternalAppLoader;
