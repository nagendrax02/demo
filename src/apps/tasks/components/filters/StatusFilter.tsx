import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchTaskStatus } from '../../utils';
import styles from '../../tasks.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

interface IStatusFilter {
  selectedStatus: IOption;
  setSelectedStatus: React.Dispatch<React.SetStateAction<IOption>>;
}

export const StatusFilter = (props: IStatusFilter): JSX.Element => {
  const { selectedStatus, setSelectedStatus } = props;

  const onSelect = (values: IOption[]): void => {
    setSelectedStatus(values[0]);
  };

  return (
    <div className={styles.status_filter_wrapper}>
      <Dropdown
        fetchOptions={fetchTaskStatus}
        selectedValues={[selectedStatus]}
        setSelectedValues={onSelect}
        hideClearButton
        showCheckIcon
      />
    </div>
  );
};
