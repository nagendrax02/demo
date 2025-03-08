import { isSelectAll } from 'common/utils/helpers/helpers';
import {
  useRecordCount as getRecordCount,
  useSmartViewTab as getSmartViewTab
} from '../../smartview-tab.store';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

const getTotalPages = (totalRecords: number, pageSize: number): number => {
  return totalRecords ? Math.ceil(totalRecords / pageSize) : 0;
};

const getPageSize = (totalRecords: number, pageSize: number): number => {
  return totalRecords <= pageSize ? totalRecords : pageSize;
};

export const getGridConfig = (
  tabId: string,
  leadLength: number,
  updateAllEntity?: boolean
): {
  pageSize: number;
  isSelectAll: boolean;
  totalRecords: number;
  totalPages: number;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  updateAll?: boolean;
} => {
  const tabData = getSmartViewTab(tabId);
  const fetchCriteria = tabData?.gridConfig?.fetchCriteria;
  const totalRecord = getRecordCount(tabId);
  const pageSize = parseInt(`${fetchCriteria?.PageSize || 0}`, 10);

  return {
    pageSize: getPageSize(totalRecord, pageSize),
    isSelectAll: isSelectAll(totalRecord, pageSize, leadLength),
    totalRecords: totalRecord || 0,
    totalPages: getTotalPages(totalRecord, pageSize),
    leadTypeConfiguration: tabData.leadTypeConfiguration,
    updateAll: updateAllEntity
  };
};
