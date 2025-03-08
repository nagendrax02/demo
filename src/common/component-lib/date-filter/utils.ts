import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IAuthenticationConfig } from 'common/types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDate, IDateOption } from './date-filter.types';
import { OPTIONS_ARRAY, OPTIONS_OBJ, WEEK_DAY_NUMBER } from './constants';
import {
  add,
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfTomorrow,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfYear,
  startOfYesterday
} from '@lsq/nextgen-preact/date/utils';

export const fetchOptions = async (): Promise<IOption[]> => {
  return OPTIONS_ARRAY;
};

export const fetchv2Options = async (): Promise<IOption[]> => {
  return OPTIONS_ARRAY.slice(1);
};

export const getDefaultOption = (selectedOption: IOption | undefined): IOption => {
  return selectedOption
    ? { label: selectedOption.label, value: selectedOption.value }
    : OPTIONS_OBJ.ALL_TIME;
};

export const getWeekStartOn = (): number => {
  const authDetails: IAuthenticationConfig | null = getItem(StorageKey.Auth);
  const definedWeek = authDetails?.Tenant?.DefinedWeek as string;
  const weekDay = definedWeek?.split('to')[0]?.trim();
  return WEEK_DAY_NUMBER[weekDay];
};

export const getCustomRange = (
  startDate: Date,
  endDate: Date,
  showDateTimePickerForCustom?: boolean
): IDate => {
  return {
    startDate: showDateTimePickerForCustom ? startDate : startOfDay(startDate),
    endDate: showDateTimePickerForCustom ? endDate : endOfDay(endDate)
  };
};

export const getYesterday = (): IDate => {
  return {
    startDate: startOfYesterday(),
    endDate: endOfYesterday()
  };
};

export const getToday = (): IDate => {
  return {
    startDate: startOfToday(),
    endDate: endOfToday()
  };
};

export const getTomorrow = (): IDate => {
  return {
    startDate: startOfTomorrow(),
    endDate: endOfTomorrow()
  };
};

export const getLastWeek = (): IDate => {
  const weekStartOn = { weekStartOn: getWeekStartOn() };
  const date = add(startOfWeek(startOfToday(), weekStartOn), {
    days: -1
  });
  return {
    startDate: startOfWeek(date, weekStartOn),
    endDate: endOfWeek(date, weekStartOn)
  };
};

export const getThisWeek = (): IDate => {
  const weekStartOn = { weekStartOn: getWeekStartOn() };
  const date = startOfWeek(startOfToday(), weekStartOn);
  return {
    startDate: date,
    endDate: endOfWeek(startOfToday(), weekStartOn)
  };
};

export const getNextWeek = (): IDate => {
  const weekStartOn = { weekStartOn: getWeekStartOn() };
  const date = add(endOfWeek(startOfToday(), weekStartOn), {
    days: 1
  });
  return {
    startDate: startOfWeek(date, weekStartOn),
    endDate: endOfWeek(date, weekStartOn)
  };
};

export const getLastMonth = (): IDate => {
  return {
    startDate: startOfMonth(add(startOfMonth(startOfToday()), { days: -1 })),
    endDate: endOfMonth(add(startOfMonth(startOfToday()), { days: -1 }))
  };
};

export const getThisMonth = (): IDate => {
  return {
    startDate: startOfMonth(startOfToday()),
    endDate: endOfMonth(startOfToday())
  };
};

export const getNextMonth = (): IDate => {
  return {
    startDate: startOfMonth(add(endOfMonth(startOfToday()), { days: 1 })),
    endDate: endOfMonth(add(endOfMonth(startOfToday()), { days: 1 }))
  };
};

export const getLastYear = (): IDate => {
  return {
    startDate: startOfYear(add(startOfYear(startOfToday()), { days: -1 })),
    endDate: endOfYear(add(startOfYear(startOfToday()), { days: -1 }))
  };
};

export const getThisYear = (): IDate => {
  return {
    startDate: startOfYear(startOfToday()),
    endDate: endOfYear(startOfToday())
  };
};

export const getNextYear = (): IDate => {
  return {
    startDate: startOfYear(add(endOfYear(startOfToday()), { days: 1 })),
    endDate: endOfYear(add(endOfYear(startOfToday()), { days: 1 }))
  };
};

export const getLast7Days = (): IDate => {
  return {
    startDate: add(startOfToday(), { days: -6 }),
    endDate: endOfToday()
  };
};

export const getLast30Days = (): IDate => {
  return {
    startDate: add(startOfToday(), { days: -29 }),
    endDate: endOfToday()
  };
};

export const getNext7Days = (): IDate => {
  return {
    startDate: startOfTomorrow(),
    endDate: add(endOfToday(), { days: 7 })
  };
};

export const utcFormat = (date: string): string => {
  return date && date.substr(0, 19).replace('T', ' ');
};

const getDateOption = (selectedValue: IOption, date: IDate): IDateOption => {
  return {
    ...selectedValue,
    startDate: utcFormat(date.startDate.toISOString()),
    endDate: utcFormat(date.endDate.toISOString())
  };
};

const dateOptionMap: { [key: string]: (selectedValue: IOption) => IDateOption } = {
  [OPTIONS_OBJ.TODAY.value]: (selectedValue: IOption) => getDateOption(selectedValue, getToday()),
  [OPTIONS_OBJ.YESTERDAY.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getYesterday()),
  [OPTIONS_OBJ.TOMORROW.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getTomorrow()),
  [OPTIONS_OBJ.LAST_WEEK.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getLastWeek()),
  [OPTIONS_OBJ.THIS_WEEK.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getThisWeek()),
  [OPTIONS_OBJ.NEXT_WEEK.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getNextWeek()),
  [OPTIONS_OBJ.LAST_MONTH.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getLastMonth()),
  [OPTIONS_OBJ.THIS_MONTH.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getThisMonth()),
  [OPTIONS_OBJ.NEXT_MONTH.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getNextMonth()),
  [OPTIONS_OBJ.LAST_YEAR.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getLastYear()),
  [OPTIONS_OBJ.THIS_YEAR.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getThisYear()),
  [OPTIONS_OBJ.NEXT_YEAR.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getNextYear()),
  [OPTIONS_OBJ.LAST_7_DAYS.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getLast7Days()),
  [OPTIONS_OBJ.LAST_30_DAYS.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getLast30Days()),
  [OPTIONS_OBJ.NEXT_7_DAYS.value]: (selectedValue: IOption) =>
    getDateOption(selectedValue, getNext7Days())
};

export const getSelectedValueDateOption = (selectedValue: IOption): IDateOption => {
  if (dateOptionMap[selectedValue.value]) return dateOptionMap[selectedValue.value](selectedValue);
  return { ...selectedValue, startDate: '', endDate: '' };
};

export const getCustomDateOption = ({
  endDate,
  selectedValue,
  startDate,
  showDateTimePickerForCustom
}: {
  selectedValue: IOption;
  startDate: Date;
  endDate: Date;
  showDateTimePickerForCustom?: boolean;
}): IDateOption => {
  return getDateOption(
    selectedValue,
    getCustomRange(startDate, endDate, showDateTimePickerForCustom)
  );
};

export const formatDateTime = (date: string): Date => {
  const formattedDateTime = new Date(date + 'Z');
  return formattedDateTime;
};

export const shouldUpdateDate = (currentDate: Date | undefined, newDateString: string): boolean => {
  const newDate = formatDateTime(newDateString);
  return !currentDate || currentDate.toString() !== newDate.toString();
};
