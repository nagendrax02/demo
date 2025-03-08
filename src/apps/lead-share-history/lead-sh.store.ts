import { trackError } from 'common/utils/experience/utils/track-error';
import { create } from 'zustand';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants/api-routes';
import { ILeadShareStore, IResponse, Status } from './lead-sh.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { augmentRecords, getUsersList, getUsersMap } from './utils';
import { allUsersOption } from './constants';

const initialState: ILeadShareStore = {
  records: [],
  loading: true,
  usersList: [allUsersOption],
  usersMap: undefined,
  selectedUser: allUsersOption,
  status: {
    label: 'All Statuses',
    value: `${Status.All}`
  }
};

const useLeadShareStore = create<ILeadShareStore>(() => ({
  ...initialState
}));

export const getLeadShareRecords = async ({
  leadAutoId,
  status,
  selectedUser
}: {
  leadAutoId: string;
  status: string;
  selectedUser: string;
}): Promise<void> => {
  try {
    useLeadShareStore.setState({ loading: true, records: [] });
    const state = useLeadShareStore.getState();
    let { usersMap } = state;
    const promiseArray = [
      httpPost({
        path: API_ROUTES.getLeadShareHistory,
        module: Module.Marvin,
        body: {
          EntityId: leadAutoId,
          Status: status,
          UserId: selectedUser
        },
        callerSource: CallerSource.LeadShareHistory
      })
    ];
    if (!usersMap) promiseArray.push(getUsersList(leadAutoId));
    const [data, userList = state.usersList] = await Promise.all(promiseArray);
    usersMap = usersMap || getUsersMap(userList as IOption[]);
    useLeadShareStore.setState({
      records: augmentRecords((data as IResponse).Logs, usersMap),
      loading: false,
      usersMap,
      usersList: userList as IOption[]
    });
  } catch (err) {
    trackError(err);
    useLeadShareStore.setState({ records: [], loading: false });
  }
};

export const setStatus = (status: IOption): void => {
  useLeadShareStore.setState({ status });
};

export const getFilteredUsers = (search?: string): IOption[] => {
  const { usersList } = useLeadShareStore.getState();
  if (search) {
    return usersList.filter(
      (user) =>
        !!(
          user.label.toLowerCase().includes(search.toLowerCase()) ||
          user.text?.toLowerCase().includes(search.toLowerCase())
        )
    );
  }
  return usersList;
};

export const setSelectedUser = (user: IOption): void => {
  useLeadShareStore.setState({ selectedUser: user });
};

export default useLeadShareStore;
