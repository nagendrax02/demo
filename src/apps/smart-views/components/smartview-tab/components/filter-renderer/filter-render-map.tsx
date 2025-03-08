import DateTime from './components/date-time';
import GroupedMSWithoutSelectAll from './components/grouped-ms-without-select-all';
import MSWithoutSelectAll from './components/ms-without-select-all';
import OppTypeDropdown from './components/opp-type';
import TaskTypeDropdown from './components/task-type';
import SearchableSingleSelect from './components/SearchableSingleSelect';
import UserDropdown from './components/user-dropdown';
import { FilterRenderType } from './constants';

const filterRenderMap = {
  [FilterRenderType.GroupedMSWithoutSelectAll]: GroupedMSWithoutSelectAll,
  [FilterRenderType.MSWithoutSelectAll]: MSWithoutSelectAll,
  [FilterRenderType.DateTime]: DateTime,
  [FilterRenderType.UserDropdown]: UserDropdown,
  [FilterRenderType.TaskType]: TaskTypeDropdown,
  [FilterRenderType.OppType]: OppTypeDropdown,
  [FilterRenderType.SearchableSingleSelect]: SearchableSingleSelect,
  [FilterRenderType.None]: (): JSX.Element => <></>
};

export default filterRenderMap;
