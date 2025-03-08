import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IRecordType,
  ITabConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { fetchGridRecords } from 'apps/smart-views/components/smartview-tab/utils';
import { EntityType } from 'common/types';
import {
  IGetKeyData,
  ICommonProps,
  IHandleNext,
  IHandlePrev,
  IIsPreviousDisabled,
  IIsNextDisabled,
  IRetrieveBoundaryRecord,
  PositionItem,
  IRecordDelete
} from './full-screen-header.types';
import {
  setVisitedLink,
  updateActiveTabIdInUrl,
  getLeadName,
  setIsStoreResetNeeded
} from 'common/utils/helpers/helpers';
import {
  resetFullScreenDetails,
  setFullScreenLoading,
  setFullScreenRecords,
  setFullScreenTitle
} from './full-screen.store';
import { setActiveTabId } from 'apps/smart-views/smartviews-store';
import {
  refreshGrid,
  setActiveTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { TabType, TabTypeToNameMap } from 'apps/smart-views/constants/constants';
import { resetActiveTabKey } from '../entity-tabs/store/entitytabs.store';

//store schema name for which navigation action should be shown
export const showNavigationSchema: Record<EntityType, string> = {
  [EntityType.Lead]: 'ProspectID',
  [EntityType.Opportunity]: 'ProspectActivityId',
  [EntityType.Account]: 'CompanyId',
  [EntityType.Activity]: '', // will add data later
  [EntityType.Task]: '', // will add data later
  [EntityType.AccountActivity]: '', // will add data later
  [EntityType.Lists]: '',
  [EntityType.Ticket]: ''
};

// store schema name in lower case as values, as for different entity types schema name is different
export const key: Record<EntityType, string[]> = {
  [EntityType.Lead]: ['prospectid', 'p_prospectid'],
  [EntityType.Opportunity]: ['prospectactivityid'],
  [EntityType.Account]: ['companyid'],
  [EntityType.Activity]: [], // will add data later
  [EntityType.Task]: [], // will add data later
  [EntityType.AccountActivity]: [], // will add data later
  [EntityType.Lists]: [],
  [EntityType.Ticket]: []
};

const getKeyData = (props: IGetKeyData): string => {
  const { records, type, recordIndex } = props;
  const searchKey = key?.[type];

  const objectKey = Object.keys(records?.[recordIndex] || {})?.find(
    (k) => searchKey?.includes(k?.toLowerCase())
  );
  if (objectKey) {
    const id = records?.[recordIndex]?.[objectKey] ?? '';
    setVisitedLink(id);
    return id;
  }
  return '';
};

const getKeyTitle = (props: IGetKeyData): string => {
  const { records, type, recordIndex } = props;
  const item = records[recordIndex];
  if (type === EntityType.Lead) {
    return getLeadName(item);
  } else if (type === EntityType.Opportunity) {
    return item.mx_Custom_1 ?? '';
  }
  return '';
};

export const getSelectedRecordIndex = (props: ICommonProps): number => {
  const { records, type, selectedRecordId } = props;
  const searchKey = key?.[type];

  return records?.findIndex((item) => {
    return Object.keys(item || {})?.some((objectKey) => {
      return (
        searchKey?.includes(objectKey?.toLowerCase()) && item?.[objectKey] === selectedRecordId
      );
    });
  });
};

export const callAPI = async (
  tabData: ITabConfig,
  pageIndex: number,
  activeTabId: string
): Promise<IRecordType[]> => {
  try {
    const fetchPageIndex = pageIndex;
    const { gridRecords } = await fetchGridRecords({
      gridConfig: {
        ...tabData?.gridConfig,
        fetchCriteria: {
          ...tabData?.gridConfig?.fetchCriteria,
          PageIndex: fetchPageIndex
        }
      },
      handlePageSelect: () => {},
      handlePageSizeSelection: () => {},
      tabId: activeTabId,
      headerConfig: tabData?.headerConfig
    });
    return gridRecords;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const retrieveBoundaryRecord = async (props: IRetrieveBoundaryRecord): Promise<void> => {
  const { tabData, pageIndex, activeTabId, positionItem, setApiCallMade, records } = props;
  const newRecords = await callAPI(tabData, pageIndex, activeTabId);
  if (positionItem === PositionItem.First) {
    setFullScreenRecords([...newRecords, ...records]);
  } else {
    setFullScreenRecords([...records, ...newRecords]);
  }
  setApiCallMade(true);
};

export const handleNext = async (props: IHandleNext): Promise<void> => {
  const {
    setFullScreenSelectedRecordId,
    records,
    selectedRecordId,
    type,
    tabData,
    pageIndex,
    activeTabId,
    apiCallMade,
    setApiCallMade,
    setRecordIndexCount
  } = props;

  const currentRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });

  // we will call next page api when user is on second last record and press next button
  if (records && records?.length - 2 == currentRecordIndex && !apiCallMade) {
    setFullScreenLoading(true);
    const updatedRecords = await callAPI(tabData, pageIndex + 1, activeTabId);
    setFullScreenRecords([...records, ...updatedRecords]);
    setApiCallMade(true);
  }

  if (currentRecordIndex > -1) {
    setFullScreenSelectedRecordId(
      getKeyData({ records, type, recordIndex: currentRecordIndex + 1 })
    );
    setFullScreenTitle(getKeyTitle({ records, type, recordIndex: currentRecordIndex + 1 }));
    setRecordIndexCount((prev) => prev + 1);
  }
  setFullScreenLoading(false);
};

export const handlePrev = (props: IHandlePrev): void => {
  const { records, type, selectedRecordId, setFullScreenSelectedRecordId, setRecordIndexCount } =
    props;
  const currentRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });
  if (currentRecordIndex > -1) {
    setFullScreenSelectedRecordId(
      getKeyData({ records, type, recordIndex: currentRecordIndex - 1 })
    );
    setFullScreenTitle(getKeyTitle({ records, type, recordIndex: currentRecordIndex - 1 }));
    setRecordIndexCount((prev) => prev - 1);
  }
};

export const isPreviousDisabled = (props: IIsPreviousDisabled): boolean => {
  const { records, selectedRecordId, type, pageIndex } = props;
  const currentRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });
  return currentRecordIndex === 0 && pageIndex === 1;
};

export const isNextDisabled = (props: IIsNextDisabled): boolean => {
  const { records, selectedRecordId, type, recordLength, pageSize, pageIndex } = props;
  const currentRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });
  return (pageIndex - 1) * pageSize + currentRecordIndex === recordLength - 1;
};

export const getRecordIndex = (
  pageIndex: number,
  selectedRecordIndex: number,
  pageSize: number
): number => {
  return (pageIndex - 1) * pageSize + (selectedRecordIndex + 1);
};

export const handleClose = (tabData: ITabConfig, activeTabId: string): void => {
  setActiveTabId(tabData.id);
  setActiveTab(tabData.id);
  updateActiveTabIdInUrl(tabData.id);
  resetFullScreenDetails();
  refreshGrid(activeTabId);
  setIsStoreResetNeeded(true);
  resetActiveTabKey();
};

export const showNavigation = (type: EntityType, tabDataType: TabType): boolean => {
  return type?.toLowerCase() === TabTypeToNameMap[tabDataType]?.toLowerCase();
};

export const getPageSize = (tabData: ITabConfig): number => {
  return tabData?.gridConfig?.fetchCriteria?.PageSize;
};

export const getPageIndex = (tabData: ITabConfig): number => {
  return tabData?.gridConfig?.fetchCriteria?.PageIndex;
};

// eslint-disable-next-line max-lines-per-function
export const handleRecordDelete = (props: IRecordDelete): void => {
  const {
    tabData,
    records,
    type,
    selectedRecordId,
    setFullScreenSelectedRecordId,
    setRecordIndexCount,
    pageIndex,
    activeTabId,
    apiCallMade,
    setApiCallMade
  } = props;
  const recordLength = tabData?.recordCount;

  // this will return record index with reference to page size
  const currentRecordIndex = getSelectedRecordIndex({
    records,
    type,
    selectedRecordId
  });

  // this will return actual record index with reference to whole record grid data
  const currentRecordActualIndex =
    (getPageIndex(tabData) - 1) * getPageSize(tabData) + currentRecordIndex;

  const isLastRecordDeleted = currentRecordActualIndex === recordLength - 1;

  // if deleted record is last record and there is more than one record then we will call handle prev
  // and move to previous record, else if it is last record and there is no more record,
  // then we will close the full screen else we will call handle next
  // if the case is where navigation is disabled then we will close the full screen
  if (isLastRecordDeleted && currentRecordActualIndex > 0 && showNavigation(type, tabData?.type)) {
    handlePrev({
      setFullScreenSelectedRecordId,
      records,
      selectedRecordId,
      type,
      setRecordIndexCount
    });
  } else if (!isLastRecordDeleted && showNavigation(type, tabData?.type)) {
    handleNext({
      setFullScreenSelectedRecordId,
      records,
      selectedRecordId,
      type,
      tabData,
      pageIndex,
      activeTabId,
      apiCallMade,
      setApiCallMade,
      setRecordIndexCount
    });
  } else {
    handleClose(tabData, activeTabId);
  }
};
