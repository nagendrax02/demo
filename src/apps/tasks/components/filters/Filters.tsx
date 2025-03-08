import DateFilter, { IDateOption } from 'common/component-lib/date-filter';
import { useEffect, useState } from 'react';
import { StatusFilter } from './StatusFilter';
import useTasksStore from '../../tasks.store';
import { DEFAULT_DATE, DefaultStatusOption } from '../../constants';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';

const Filters = (): JSX.Element => {
  const dateFromLS: IDateOption | null = getItem(StorageKey.TasksDateFilter);
  const statusFromLS: IOption | null = getItem(StorageKey.TasksStatusFilter);
  const [selectedDate, setSelectedDate] = useState<IDateOption>(dateFromLS || DEFAULT_DATE);
  const [selectedStatus, setSelectedStatus] = useState<IOption>(
    statusFromLS || DefaultStatusOption
  );
  const { setDate, setRefresh, setStatusCode } = useTasksStore();

  useEffect(() => {
    setDate({
      startDate: selectedDate?.startDate,
      endDate: selectedDate?.endDate
    });
    setItem(StorageKey.TasksDateFilter, selectedDate);
    setRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (selectedStatus) {
      setStatusCode(+selectedStatus?.value);
      setItem(StorageKey.TasksStatusFilter, selectedStatus);
      setRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  return (
    <>
      <StatusFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      <DateFilter selectedOption={selectedDate} setSelectedOption={setSelectedDate} />
    </>
  );
};

export default Filters;
