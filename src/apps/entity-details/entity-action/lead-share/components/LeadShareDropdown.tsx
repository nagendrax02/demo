import { fetchOptions } from '../utils';
import { LEAD_SHARE_GROUP_CONFIG, SEARCH_LENGTH } from '../constants';
import styles from '../lead-share.module.css';
import GroupedOptionDropdown, {
  IGroupedOption
} from '../../../../../common/component-lib/grouped-option-dropdown';
import { CallerSource } from 'common/utils/rest-client';

interface ILeadShareDropdown {
  setSelectedUsers: React.Dispatch<React.SetStateAction<IGroupedOption[]>>;
  selectedUsers: IGroupedOption[];
}

const LeadShareDropdown = (props: ILeadShareDropdown): JSX.Element => {
  const { setSelectedUsers, selectedUsers } = props;

  const onOptionSelect = (option: IGroupedOption): void => {
    setSelectedUsers((prevUsers) => [...prevUsers, option]);
  };

  const onOptionClear = (option: IGroupedOption): void => {
    setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.value !== option.value));
  };

  const handleFetchOptions = async (searchText?: string): Promise<IGroupedOption[]> => {
    return fetchOptions(CallerSource.LeadDetailsVCard, searchText);
  };

  return (
    <GroupedOptionDropdown
      selectedOptions={selectedUsers}
      groupConfig={LEAD_SHARE_GROUP_CONFIG}
      fetchOptions={handleFetchOptions}
      onOptionSelect={onOptionSelect}
      onOptionClear={onOptionClear}
      removeGrouping
      customStyleClass={styles.input}
      customDropdownStyleClass={styles.menu}
      placeholder="Search to Select"
      minSearchCharacter={SEARCH_LENGTH}
      swapOrientation={false}
      stickyMenu
    />
  );
};

export default LeadShareDropdown;
