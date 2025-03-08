import styles from '../lead-sh.module.css';
import useLeadShareStore, { setStatus, setSelectedUser, getFilteredUsers } from '../lead-sh.store';
import { statusFilters } from '../constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const LeadShareFilters = (): JSX.Element => {
  const { status, selectedUser, usersList } = useLeadShareStore((state) => ({
    status: state.status,
    usersList: state.usersList,
    selectedUser: state.selectedUser
  }));

  const handleStatus = (value): void => {
    setStatus(value[0]);
  };

  const handleUserSelection = (value): void => {
    setSelectedUser(value[0]);
  };

  return (
    <div className={styles.filters_container}>
      <div className={`${styles.user_filter} ${styles.filter}`}>
        <Dropdown
          showCheckIcon
          hideClearButton
          fetchOptions={getFilteredUsers}
          setSelectedValues={handleUserSelection}
          selectedValues={[selectedUser]}
          useParentDropdownOptions={usersList}
          renderConfig={{
            customMenuDimension: { height: 266 }
          }}
        />
      </div>
      <div className={`${styles.status_filter} ${styles.filter}`}>
        <Dropdown
          disableSearch
          showCheckIcon
          hideClearButton
          fetchOptions={() => statusFilters}
          setSelectedValues={handleStatus}
          selectedValues={[status]}
        />
      </div>
    </div>
  );
};

export default LeadShareFilters;
