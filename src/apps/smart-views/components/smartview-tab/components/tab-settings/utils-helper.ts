/* eslint-disable complexity */
import { IAuthDetails } from 'common/utils/authentication/authentication.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { OptionSeperator } from '../filter-renderer/constants';
import { TabType } from 'apps/smart-views/constants/constants';

export const removeSeparator = (value: string | null): string | null => {
  if (value === null) {
    return null;
  }
  if (value.includes(OptionSeperator.MXSeparator)) {
    return value.replaceAll(OptionSeperator.MXSeparator, ',');
  }

  return value;
};

export const createLookUPNameAndValue = (
  ownerFilter: string
): {
  lookupName: string;
  lookupValue: string;
} => {
  const userDetails = getItem(StorageKey.UserAuthDetails) as IAuthDetails;

  const selectedOwnerFilter = ownerFilter || 'MyTasks';
  const lookupFilter =
    selectedOwnerFilter === 'AssignedTasks' || selectedOwnerFilter === 'MyTasks'
      ? selectedOwnerFilter
      : 'SpecificUserTasks';

  let lookupName: string;
  let lookupValue: string;
  switch (lookupFilter) {
    case 'AssignedTasks':
      lookupName = 'AssignedBy';
      lookupValue = userDetails?.userId;
      break;
    case 'SpecificUserTasks':
      lookupName = 'SpecificUserId';
      lookupValue = removeSeparator(selectedOwnerFilter) || selectedOwnerFilter;
      break;
    default:
      lookupName = 'OwnerId';
      lookupValue = userDetails?.userId;
      break;
  }
  if (!ownerFilter || ownerFilter === 'any') {
    lookupName = 'Any';
    lookupValue = '';
  }

  return { lookupName, lookupValue };
};

export const getStatusCode = (schemaValue: string | null): number => {
  let statusCode = -1;
  if (schemaValue) {
    switch (schemaValue) {
      case '':
        statusCode = -1;
        break;
      case 'pending':
        statusCode = 0;
        break;
      case 'completed':
        statusCode = 1;
        break;
      case 'cancelled':
        statusCode = 2;
        break;
      default:
        statusCode = -1;
    }
  }
  return statusCode;
};

export const canCallTaskAsync = (
  recordsCount: number,
  minRecordForAsyncRequest: number
): boolean => {
  return recordsCount > minRecordForAsyncRequest;
};

export const getTaskSelectedFields = (
  recordsCount: number,
  minRecordForAsyncRequest: number
): string => {
  const selectedFields = ['Name', 'StatusCode', 'DueDate', 'Reminder', 'CreatedBy', 'OwnerId'];
  if (recordsCount >= minRecordForAsyncRequest) {
    selectedFields.unshift('UserTaskAutoId');
  }
  return selectedFields.join(',');
};

export const getEntityRepName = (tabType: TabType): string => {
  const repName = {
    [TabType.Lead]: 'Lead',
    [TabType.Activity]: 'Activity',
    [TabType.Opportunity]: 'Opportunity',
    [TabType.Task]: 'Task'
  };

  if (repName[tabType]) return repName[tabType] as string;

  return 'Data';
};
