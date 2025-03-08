import { trackError } from 'common/utils/experience/utils/track-error';
import { getLeadName, setVisitedLink } from 'common/utils/helpers/helpers';
import { fetchOppTypeOptions } from '../custom-tabs/lead-opportunity-tab/fetch-options';
import { IRecordType, IRowActionConfig, ITabConfig } from '../smartview-tab/smartview-tab.types';
import { EntityType } from 'common/types';
import {
  setFullScreenEntityTypeCode,
  setFullScreenSelectedRecordId,
  setFullScreenShow,
  setFullScreenType
} from 'common/component-lib/full-screen-header';
import { TAB_VIEW_MAP } from '../../augment-tab-data/task/constants';
import { isManageListTab, isSmartviewTab } from '../../utils/utils';
import { getItem, StorageKey } from 'common/utils/storage-manager';
import { setFullScreenTitle } from 'common/component-lib/full-screen-header/full-screen.store';
import { TABS_CACHE_KEYS } from '../custom-tabs/constants';
import { INTERNAL_LIST_NAME } from '../custom-tabs/manage-lists/constants';
import { ACTION } from 'apps/entity-details/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';

export const getDefaultOppName = async (
  record: IRecordType,
  activityEvent: string | null
): Promise<string> => {
  try {
    const allOppTypes = await fetchOppTypeOptions();
    const selectedOppType = allOppTypes?.find((type) => type.value === activityEvent);
    return `${getLeadName(record as Record<string, string | null>)} - ${
      selectedOppType?.label ?? 'Opportunity'
    }`;
  } catch (err) {
    trackError(err);
  }
  return 'Opportunity';
};

export const handleEntityClick = ({
  entity,
  recordId,
  entityTypeCode,
  repName
}: {
  entity: EntityType;
  recordId: string;
  entityTypeCode?: string;
  repName: string;
}): void => {
  setVisitedLink(recordId);
  setFullScreenShow(true);
  setFullScreenType(entity);
  setFullScreenSelectedRecordId(recordId);
  if (entity === EntityType.Opportunity) {
    setFullScreenEntityTypeCode(entityTypeCode ?? '');
  }
  setFullScreenTitle(repName);
};

export const openInFullScreen = (
  tabData: ITabConfig,
  activeTab: string,
  disableFullScreen = false
): boolean => {
  if (disableFullScreen) return false;
  return (
    (getItem(StorageKey.Setting) as Record<string, string>)?.IsLeadDetailsFullScreenModeEnabled ===
      '1' &&
    isSmartviewTab(activeTab) &&
    tabData?.tabView !== TAB_VIEW_MAP.calendar
  );
};

export const excludeNameFromRecord = (tabId: string): boolean => {
  return tabId !== TABS_CACHE_KEYS.MANAGE_LISTS_TAB;
};

const isHiddenInternalList = (item: IActionConfig, record?: IRecordType): boolean | undefined => {
  return item?.hideForInternalList && INTERNAL_LIST_NAME.includes(record?.InternalName ?? '');
};

const isListUnhideAction = (item: IActionConfig, isHiddenList?: boolean): boolean => {
  return !isHiddenList && item?.key === ACTION.ListUnhide;
};

const isHideAction = (item: IActionConfig, isHiddenList?: boolean): boolean => {
  return !isHiddenList && item?.key === ACTION.ListHide;
};

const isHiddenListUnhideAction = (
  item: IActionConfig,
  isHiddenList?: boolean
): boolean | undefined => {
  return isHiddenList && item?.key === ACTION.ListUnhide;
};

const isHiddenListHideAction = (
  item: IActionConfig,
  isHiddenList?: boolean
): boolean | undefined => {
  return isHiddenList && item?.key === ACTION.ListHide;
};

const filterActions = (
  actions: IActionConfig[] | IActionMenuItem[],
  isHiddenList?: boolean,
  record?: IRecordType
): IActionConfig[] | IActionMenuItem[] => {
  return actions?.filter((item) => {
    return (
      !isHiddenInternalList(item, record) ||
      isListUnhideAction(item, isHiddenList) ||
      isHideAction(item, isHiddenList) ||
      isHiddenListUnhideAction(item, isHiddenList) ||
      isHiddenListHideAction(item, isHiddenList)
    );
  });
};

export const getFilteredAction = ({
  action,
  isHiddenList,
  record,
  tabId
}: {
  action: IRowActionConfig;
  tabId: string;
  record: IRecordType & Record<string, string>;
  isHiddenList?: boolean;
}): IRowActionConfig => {
  if (isManageListTab(tabId)) {
    return {
      ...action,
      quickActions: filterActions(action?.quickActions, isHiddenList, record),
      moreActions: filterActions(action?.moreActions, isHiddenList, record) as IActionMenuItem[]
    };
  }
  return action;
};

export const getAssociatedLeadId = (record: IRecordType): string | null => {
  return (
    record.ProspectId ??
    record?.ProspectID ??
    record?.P_ProspectID ??
    record?.PCG_PrimaryContactPropsectId
  );
};

export const getAssociatedOppName = (record: IRecordType): string | null => {
  return record?.O_mx_Custom_1;
};
