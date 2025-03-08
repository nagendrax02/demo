import { API_ROUTES } from 'src/common/constants';
import { httpPost, CallerSource, Module } from 'src/common/utils/rest-client';
import { allUsersOption, keys } from './constants';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { ILeadShareRecord } from './lead-sh.types';
import { HandleOwnerOption } from 'apps/entity-details/entity-action/change-owner';

export const getUsersList = async (
  leadAutoId: string,
  searchValue?: string
): Promise<IOption[]> => {
  try {
    const UserIds: string[] = await httpPost({
      path: API_ROUTES.getSharedUserIds,
      module: Module.Marvin,
      body: { EntityId: leadAutoId },
      callerSource: CallerSource.LeadShareHistory
    });
    let response: IOption[] = UserIds.length
      ? await httpPost({
          path: API_ROUTES.getSharedUsers,
          module: Module.Marvin,
          body: {
            UserIds: [...UserIds],
            SearchText: searchValue
          },
          callerSource: CallerSource.LeadShareHistory
        })
      : [];
    if (!searchValue || keys.Any.toLowerCase().includes(searchValue.toLowerCase())) {
      response = [allUsersOption, ...response];
    }
    if (response?.length) {
      response.map((option) => {
        option.customComponent = HandleOwnerOption(option);
      });
    }
    return response;
  } catch (err) {
    return [];
  }
};

export const getUsersMap = (userList: IOption[]): Record<string, string> => {
  return userList.reduce((acc: Record<string, string>, user) => {
    if (user.value) {
      acc[user.value] = user.label;
    }
    return acc;
  }, {});
};

export const augmentRecords = (
  records: ILeadShareRecord[],
  usersMap: Record<string, string>
): ILeadShareRecord[] => {
  return records.map((item) => ({ ...item, UserName: usersMap[item.UserId] }));
};
