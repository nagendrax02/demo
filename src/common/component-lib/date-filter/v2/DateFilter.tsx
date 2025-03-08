import { useMemo } from 'react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IDateFilter } from './date-filter.types';
import { getDefaultOption, getSelectedValueDateOption, utcFormat } from '../utils';
import { OPTIONS_OBJ } from '../constants';
import { DateRangeFilterDropdown, IDateRange } from '@lsq/nextgen-preact/v2/date';
import {
  offsetLocalDateToUserDate,
  offsetUserDateToLocalDate,
  offsetUtcDateToLocalDate
} from 'src/common/utils/date';

const DateFilter = (props: IDateFilter): JSX.Element => {
  const {
    selectedOption,
    setSelectedOption,
    onCustomOptionSelection,
    customStyleClass,
    showDateTimePickerForCustom,
    avoidUTCFormatting,
    getTrigger,
    openOnRender,
    includeSecondsForEndDate,
    onOpenChange
  } = props;

  const getLocalDateFromUtcString = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    return new Date(dateString + ' UTC');
  };

  const selectedValue = useMemo(() => getDefaultOption(selectedOption), [selectedOption]);
  const selectedRange: IDateRange = useMemo(() => {
    if (selectedOption?.value === OPTIONS_OBJ.CUSTOM.value) {
      const { startDate, endDate } = selectedOption;
      if (avoidUTCFormatting) {
        return [new Date(startDate), new Date(endDate)];
      }
      return [
        offsetLocalDateToUserDate(getLocalDateFromUtcString(startDate)),
        offsetLocalDateToUserDate(getLocalDateFromUtcString(endDate))
      ];
    }
    return [null, null];
  }, [selectedOption, avoidUTCFormatting]);

  const getSecondsValue = (date: Date | null): Date | null => {
    if (!date) return null;
    if (showDateTimePickerForCustom) {
      if (typeof includeSecondsForEndDate === 'boolean' && !includeSecondsForEndDate) {
        return new Date(date.setSeconds(0));
      }
      return new Date(date.setSeconds(59));
    }
    return date;
  };

  const getUtcDateString = (date: Date | null): string => {
    if (!date) return '';
    return avoidUTCFormatting
      ? utcFormat(offsetUtcDateToLocalDate(date)?.toISOString() ?? '')
      : utcFormat(offsetUserDateToLocalDate(date)?.toISOString() ?? '');
  };

  const handleSelection = (option: IOption, dateRange: IDateRange): void => {
    if (option?.value !== OPTIONS_OBJ.CUSTOM.value) {
      setSelectedOption({
        ...getSelectedValueDateOption(option),
        startDate: '',
        endDate: ''
      });
      return;
    }

    onCustomOptionSelection?.();
    const startDate = getUtcDateString(dateRange[0]);
    const endDate = getUtcDateString(getSecondsValue(dateRange[1]));
    setSelectedOption({
      ...getSelectedValueDateOption(option),
      startDate,
      endDate
    });
  };

  return (
    <div className={`${customStyleClass} date_filter_wrapper`}>
      <DateRangeFilterDropdown
        defaultOpen={openOnRender}
        selectedOption={selectedValue}
        selectedRange={selectedRange}
        onSelection={handleSelection}
        getTrigger={
          getTrigger as (
            open: boolean,
            setSelectedValues: (selectedValues: IOption[]) => void
          ) => React.ReactNode
        }
        onOpenChange={onOpenChange}
        enableTimeRange={showDateTimePickerForCustom}
      />
    </div>
  );
};

DateFilter.defaultProps = {
  showDateTimePickerForCustom: false,
  includeSecondsForEndDate: false,
  avoidUTCFormatting: false
};

export default DateFilter;
