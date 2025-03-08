import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { getTabSettings } from '../../augment-tab-data/common-utilities/tab-settings';
import { ITabResponse } from '../../smartviews.types';
import { handleTabDelete } from '../../utils/utils';
import { IInfo } from '../smartview-tab/components/header/info/Info';
import { API_ROUTES } from 'common/constants';
import { getPersistedAuthConfig } from 'common/utils/authentication';

export const generateTabInfoDetails = (rawTabData: ITabResponse, allTabIds: string[]): IInfo => {
  return {
    primaryHeaderConfig: {
      title: rawTabData?.TabConfiguration?.Title,
      description: rawTabData?.TabConfiguration?.Description,
      advancedSearchEnglish:
        rawTabData?.TabContentConfiguration?.FetchCriteria?.AdvancedSearchText_English,
      modifiedByName: rawTabData?.ModifiedByName,
      modifiedOn: rawTabData?.ModifiedOn,
      autoRefreshTime: 0,
      onTabDelete: async (tabId: string): Promise<boolean> => {
        return handleTabDelete(tabId, allTabIds);
      },
      canHide: rawTabData?.TabConfiguration.CanHide,
      customType: rawTabData?.TabConfiguration?.CustomType
    },
    tabSettings: getTabSettings({ tabData: rawTabData, allTabIds }),
    tabType: rawTabData?.Type,
    entityCode: rawTabData?.EntityCode,
    tabId: ''
  };
};

export const getMailMergedTabUrl = async (
  url: string,
  tabId: string,
  smartViewId: string
): Promise<string> => {
  const userDetails = getPersistedAuthConfig()?.User;
  const tenantDetails = getPersistedAuthConfig()?.Tenant;

  const response: string = await httpPost({
    path: API_ROUTES.mailMergedContent,
    module: Module.Connector,
    body: {
      data: url
        .replace('{{accessKey}}', '@{User:AccessKey,}')
        .replace('{{secretKey}}', '@{User:SecretKey,}')
    },
    callerSource: CallerSource.SmartViews
  });

  return response
    .replace(/"/g, '')
    .replace('{{tabId}}', tabId ?? '')
    .replace('{{orgCode}}', userDetails?.OrgCode ?? '')
    .replace('{{userId}}', userDetails?.Id ?? '')
    .replace('{{isSmartViewConfigPage}}', 'false')
    .replace('{{smartViewId}}', smartViewId ?? '')
    .replace('{{regionId}}', tenantDetails?.RegionId ?? '')
    .replace('{{webAssetsVersion}}', '')
    .replace('{{culture}}', '');
};

export const convertStringToCssStyleObj = (styles: string): Record<string, string> => {
  return styles.split(';').reduce((acc, currStyle) => {
    const [styleName, styleValue] = currStyle.split(':');
    if (['height', 'width'].includes(styleName) && styleValue) {
      acc[styleName.trim()] = styleValue?.trim();
    }
    return acc;
  }, {});
};
