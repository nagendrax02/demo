import { safeParseJson } from 'common/utils/helpers';
import { IFetchCriteria, ITabResponse } from '../../smartviews.types';
import { TabMode } from './constants';
import { isCustomTypeTab } from '../../utils/utils';
import { IConfigureTabPayload, IConfigureTabHelper } from './external-components.types';

const getTabDetails = (
  mode: TabMode,
  tabDetails: ITabResponse | undefined
): ITabResponse | undefined => {
  const isCustomTab = tabDetails && isCustomTypeTab(tabDetails);
  const fetchCriteria = tabDetails?.TabContentConfiguration?.FetchCriteria;
  const parsedAdditionalData = isCustomTab
    ? undefined
    : safeParseJson(fetchCriteria?.AdditionalData || '');

  return mode === TabMode.Edit
    ? ({
        ...tabDetails,
        TabContentConfiguration: {
          ...tabDetails?.TabContentConfiguration,
          FetchCriteria: {
            ...fetchCriteria,
            AdditionalData: parsedAdditionalData
          } as IFetchCriteria
        }
      } as ITabResponse)
    : undefined;
};

export const generateConfigureTabDataToSend = (
  config: IConfigureTabHelper
): IConfigureTabPayload => {
  const {
    smartviewId,
    mode,
    isCustomTabTypeEnabled,
    tabDetails,
    LeadQuickSelectedFilter,
    isLeadTypeEnabled,
    leadTypeInternalName,
    createMode,
    editListConfig
  } = config;

  return {
    show: true,
    mode: mode,
    header: mode === TabMode.Add ? 'Create New Tab' : 'Edit Tab',
    finalNextButtonText: mode === TabMode.Add ? 'Create Tab' : 'Edit Tab',
    smartviewId: smartviewId,
    tabDetails: getTabDetails(mode, tabDetails),
    isCustomTabTypeEnabled: !!isCustomTabTypeEnabled,
    isDesktopView: true,
    LeadQuickSelectedFilter: LeadQuickSelectedFilter,
    isLeadTypeEnabled,
    leadTypeInternalName: leadTypeInternalName,
    createMode: createMode,
    editListConfig: editListConfig
  };
};
