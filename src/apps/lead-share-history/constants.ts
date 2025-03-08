import { getFormattedDateTime } from 'common/utils/date';
import { EntityShareAccessType, IShareDetail, ILeadShareRecord, Status } from './lead-sh.types';
import { IColumnConfig } from '@lsq/nextgen-preact/table/table.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { format } from '@lsq/nextgen-preact/date/utils';

export const keys = {
  Id: 'Id',
  Any: 'Any',
  Lead: 'Lead',
  Share: 'Share',
  Field: 'Field',
  Value: 'Value',
  Timestamp: 'Timestamp',
  selectedLeadShareUserKey: 'selectedLeadShareUser',
  selectedLeadShareStatusKey: 'selectedLeadShareStatusKey',
  Opportunity: 'Opportunity',
  allUsers: 'All Users'
};

export const accessMap = {
  [EntityShareAccessType.View]: 'View',
  [EntityShareAccessType.Modify]: 'Modify'
};

const sourceMap: Record<string, string> = {
  automation: 'Automation',
  ui: 'UI',
  api: 'API',
  autorevoke: 'Automatically revoked',
  agentpopup: 'Agent Popup'
};

export const formatMinutes = (minutes = 0): string => {
  try {
    return minutes > 60
      ? `${Math.floor(minutes / 60)} Hrs ${minutes % 60 ? `${minutes % 60} Mins` : ''}`
      : `${minutes} Mins`;
  } catch (error) {
    console.log('Error in formatMinutes', error);
  }
  return '';
};

const getFormatISODate = (timestamp: string, minutes: number): string => {
  try {
    return new Date(new Date(timestamp).getTime() + minutes * 60000).toString();
  } catch (error) {
    console.log('Error in getFormatISODate', error);
  }
  return '';
};

export const getDueDate = (timestamp: string, minutes?: number): string => {
  try {
    const newDate = minutes
      ? getFormattedDateTime({
          date: format({
            originalDate: getFormatISODate(timestamp, minutes),
            pattern: 'yyyy-MM-dd hh:mm:ss'
          }),
          dateTimeFormat: 'dd MMM, hh:mm a'
        })
      : '';
    return newDate;
  } catch (error) {
    console.log('Error in getDueDate', error);
  }
  return '';
};

const formatSource = (source?: string): string =>
  (source && sourceMap[source.toLowerCase()]) ?? 'Unknown';

export const getLeadShareDetailRows = (
  shareDetail: IShareDetail,
  data: ILeadShareRecord,
  failedState: boolean
): Record<string, string>[] => {
  const rows: Record<string, string>[] = [
    {
      DisplayName: 'Shared Via',
      key: 'SharedVia',
      Value: shareDetail.ContextEntityId || ''
    },
    {
      DisplayName: 'Source',
      Value: formatSource(shareDetail?.Area)
    }
  ];
  if (data.RequestType === keys.Share) {
    rows.unshift({
      DisplayName: 'Duration',
      Value: `${formatMinutes(shareDetail.DurationInMinutes)} (Till ${getDueDate(
        data.Timestamp,
        shareDetail.DurationInMinutes
      )})`
    });
  }
  if (failedState) {
    rows.push({
      DisplayName: 'Failed Reason',
      Value: data.Message
    });
  }
  return rows;
};

export const shimmerRows = [
  { DisplayName: '', Value: 'k1' },
  { DisplayName: '', Value: 'k2' },
  { DisplayName: '', Value: 'k3' }
];

export const getColumnConfig = (): IColumnConfig[] => {
  return [
    { field: 'Field', key: 'DisplayName', width: 150 },
    { field: 'Value', key: 'Value', width: 370 }
  ];
};

export const statusFilters: IOption[] = [
  {
    label: 'All Statuses',
    value: `${Status.All}`
  },
  {
    label: 'Processing',
    value: `${Status.Processing}`
  },
  {
    label: 'Completed',
    value: `${Status.Completed}`
  },
  {
    label: 'Failed',
    value: `${Status.Failed}`
  }
];

export const allUsersOption = {
  label: keys.allUsers,
  value: ''
};
