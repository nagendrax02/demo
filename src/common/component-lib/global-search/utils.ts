import { trackError } from 'common/utils/experience/utils/track-error';
import { API_ROUTES } from 'common/constants';
import { ILeadRecord } from './global-search.types';
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import { getProfileName } from 'common/utils/helpers/helpers';
import { workAreaIds } from 'common/utils/process';
import { ACTION } from 'apps/entity-details/constants';
import { isOpportunityEnabled } from 'common/utils/helpers';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { isLeadTypeEnabled } from 'common/utils/lead-type/settings';

export const listLength = 7;
const IncludeCSVKey = 'Include_CSV';

export const getQuerySearchData = async (
  value: string,
  callerSource: CallerSource
): Promise<ILeadRecord[]> => {
  try {
    const body = {
      Parameter: { SearchText: value },
      Columns: {
        [IncludeCSVKey]:
          'ProspectID,FirstName,LastName,EmailAddress,Phone,Mobile,DoNotCall,DoNotEmail'
      },
      Sorting: { ColumnName: '', Direction: 0 },
      Paging: {
        Offset: 0,
        RowCount: listLength,
        PageIndex: 1
      }
    };

    const isLeadTypeSettingEnabled = await isLeadTypeEnabled(CallerSource.GlobalSearch, true);
    if (isLeadTypeSettingEnabled)
      body.Columns[IncludeCSVKey] = body.Columns[IncludeCSVKey] + ',LeadType';

    const response: ILeadRecord[] = await httpPost({
      path: API_ROUTES.leadSearch,
      module: Module.LeadManagement,
      body,
      callerSource
    });
    return response;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const getName = (record: ILeadRecord): string => {
  return record?.FirstName || record?.LastName
    ? `${record?.FirstName || ''} ${record?.LastName || ''}`?.trim()
    : 'No Name';
};

export const getOverflowHandledName = (record: ILeadRecord): string => {
  const leadName = getName(record);
  if (leadName.length > 16 && (record?.EmailAddress || record?.Phone)) {
    return `${leadName.substring(0, 16)}...`;
  }
  return leadName;
};

export const getInitials = (record: ILeadRecord): string => {
  return getProfileName(getName(record));
};

export const handleEnterPress = (searchText: string): void => {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', API_ROUTES.setQuickSearch);
  const formElement = document.createElement('input');
  formElement.setAttribute('type', 'hidden');
  formElement.setAttribute('name', 'searchText');
  formElement.setAttribute('value', searchText);
  form.appendChild(formElement);
  document.body.appendChild(form);
  form.submit();
};

export const handleKeyboardEvents = (
  show: boolean,
  handleSearch: (close?: boolean) => void
): (() => void) => {
  const handleOnKeyPress = (event: { keyCode: number }): void => {
    const { keyCode } = event;
    if (keyCode === 27) {
      handleSearch(true);
    }
    if (keyCode === 13) {
      handleSearch();
    }
  };
  if (show) {
    document.addEventListener('keydown', handleOnKeyPress);
  } else {
    document.removeEventListener('keydown', handleOnKeyPress);
  }
  return () => {
    document.removeEventListener('keydown', handleOnKeyPress);
  };
};

const actions: IActionMenuItem[] = [
  {
    key: '204',
    id: ACTION.AddActivityForLead,
    title: 'Add New Activity',
    label: 'Activity',
    value: '204',
    toolTip: 'Activity',
    workAreaConfig: {
      workAreaId: workAreaIds.QUICK.ADD_ACTIVITY
    }
  },
  {
    key: '203',
    id: ACTION.AddTaskForLead,
    title: 'Add New Task',
    label: 'Task',
    value: '203',
    toolTip: 'Task',
    workAreaConfig: {
      workAreaId: workAreaIds.QUICK.ADD_TASK
    }
  }
];

export const getQuickAddActions = async (): Promise<IActionMenuItem[]> => {
  try {
    const isOppEnabled = await isOpportunityEnabled(CallerSource.GlobalSearch);
    if (isOppEnabled) {
      return [
        ...actions,
        {
          key: '205',
          id: ACTION.Opportunity,
          title: 'Add New Opportunity',
          label: 'Opportunity',
          value: '205',
          toolTip: 'Opportunity',
          workAreaConfig: {
            workAreaId: workAreaIds.QUICK.ADD_OPPORTUNITY
          }
        }
      ];
    }
  } catch (err) {
    trackError(err);
  }
  return [...actions];
};

export const getPhoneNumberStyle = (item: ILeadRecord): React.CSSProperties => {
  if (item?.EmailAddress) {
    return { marginInline: 'auto 12px' };
  }
  return { marginInlineEnd: '12px' };
};

export const getEmailAddressStyle = (item: ILeadRecord): React.CSSProperties => {
  if (item?.EmailAddress) {
    return { flex: '1', marginInlineEnd: '4px' };
  }
  return { flex: 'none' };
};
