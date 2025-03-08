import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, httpGet, HttpMethod, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE } from 'common/constants';
import { getFromDB, setInDB, StorageKey } from 'common/utils/storage-manager';
import { ICustomMenu, ICustomMenuResponse } from './custom-menu.types';
import { IExternalNavItem } from 'common/utils/helpers/helpers.types';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { safeParseJson } from 'common/utils/helpers';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';

export const getCustomMenuApps = async (): Promise<ICustomMenuResponse | null> => {
  try {
    let customMenus: ICustomMenuResponse | null = (await getFromDB(StorageKey.CustomMenu)) || null;
    if (customMenus) {
      return customMenus;
    }
    customMenus = await httpGet({
      callerSource: CallerSource.CustomMenu,
      module: Module.Connector,
      path: API_ROUTES.CustomMenuGet
    });
    setInDB(StorageKey.CustomMenu, customMenus);
    return customMenus;
  } catch (error) {
    trackError(error);
  }
  return null;
};

const filterRestrictedMenus = async (
  normalizedMenus: IExternalNavItem[],
  callerSource: CallerSource
): Promise<IExternalNavItem[]> => {
  const restrictionMap = {};
  await Promise.all(
    normalizedMenus?.map(async (navItem) => {
      restrictionMap[navItem.Id] = await isFeatureRestricted({
        moduleName: `CustomMenuDG_${navItem.Id}`,
        actionName: navItem.Text,
        callerSource
      });
      return;
    })
  );

  return normalizedMenus?.filter((navItem) => !restrictionMap[navItem?.Id]);
};

export const createCustomId = (categoryId: string, menuId: string): string => {
  return `${categoryId}$${menuId}`;
};
export const normalizedCustomMenuAppsList = async (
  customMenus: ICustomMenuResponse,
  callerSource: CallerSource
): Promise<{ normalizedMenus: IExternalNavItem[]; dictionary: Record<string, ICustomMenu> }> => {
  if (!customMenus?.ApplicationMenus?.length) return { normalizedMenus: [], dictionary: {} };

  const dictionary = {};
  let normalizedMenus = customMenus?.ApplicationMenus?.reduce(
    (acc: IExternalNavItem[], menuCategory) => {
      return acc.concat(
        menuCategory?.Menu?.map((menu) => {
          const customId = createCustomId(menuCategory?.Id, menu?.Id);
          if (!dictionary[customId]) {
            menu.customId = customId;
            menu.parentId = menuCategory?.Id;
            dictionary[customId] = menu;
          }
          return {
            Text: menu?.MenuConfig?.Text,
            IconURL: '',
            Id: customId,
            AppURL: menu?.AppConfig?.AppURL?.URL,
            isIconHidden: true,
            parentId: menuCategory?.Id
          };
        })
      );
    },
    []
  );
  normalizedMenus = await filterRestrictedMenus(normalizedMenus, callerSource);

  return { normalizedMenus, dictionary };
};

const getMailMergedUrl = async (appUrl: string, customId: string): Promise<string> => {
  try {
    const cachedData =
      ((await getFromDB(StorageKey.MailMergedUrls)) as Record<string, string>) || {};
    if (cachedData?.[customId]) return cachedData?.[customId];

    const response: string = await httpPost({
      path: API_ROUTES.mailMergedContent,
      module: Module.Connector,
      body: {
        data: appUrl
      },
      callerSource: CallerSource.CustomMenu
    });

    const content = (safeParseJson(response) || response) as string;
    cachedData[customId] = content;

    setInDB(StorageKey.MailMergedUrls, cachedData);

    return content;
  } catch (error) {
    trackError(error);
    showNotification({
      type: Type.ERROR,
      message: (error?.response?.ExceptionMessage as string) || EXCEPTION_MESSAGE
    });
  }
  return '';
};

export const handleCustomMenuIFrameUrl = async ({
  appUrlMethod,
  setIframeUrl,
  appUrl,
  customId
}: {
  setIframeUrl: (data: string) => void;
  appUrlMethod: HttpMethod;
  appUrl: string;
  customId: string;
}): Promise<void> => {
  if (appUrlMethod === HttpMethod.Get) {
    setIframeUrl(await getMailMergedUrl(appUrl, customId));
  }
  if (appUrlMethod === HttpMethod.Post) {
    setIframeUrl(appUrl);
  }
};

export const updateUrl = (menuId: string, categoryId: string): void => {
  try {
    const search = `?tabId=${menuId}&categoryId=${categoryId}`;
    const url = new URL(window.location.href);
    url.search = search;

    window.history.pushState({}, '', url?.toString());
  } catch (error) {
    trackError(error);
  }
};
