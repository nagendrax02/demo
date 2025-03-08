import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, useEffect, useState } from 'react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import RangePicker from './range-picker';
import { IDateFilter } from './date-filter.types';
import {
  fetchOptions,
  getDefaultOption,
  getSelectedValueDateOption,
  getCustomDateOption,
  formatDateTime,
  shouldUpdateDate
} from './utils';
import { OPTIONS_OBJ } from './constants';
import styles from './date-filter.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const DateFilter = (props: IDateFilter): JSX.Element => {
  const {
    selectedOption,
    setSelectedOption,
    renderOnBody,
    customContentStyleClass,
    showClearButton,
    onCustomOptionSelection,
    customStyleClass,
    showDateTimePickerForCustom,
    resetOptionOnValueChange,
    includeSecondsForEndDate,
    avoidUTCFormatting
  } = props;

  const [selectedValue, setSelectedValue] = useState<IOption>({ label: '', value: '' });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const resetCustomDate = (): void => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const updateCustomDate = (): void => {
    try {
      if (selectedOption?.value === OPTIONS_OBJ.CUSTOM.value) {
        const formatedStartDate = avoidUTCFormatting
          ? selectedOption.startDate
          : formatDateTime(selectedOption.startDate).toString();
        const formatedEndDate = avoidUTCFormatting
          ? selectedOption.endDate
          : formatDateTime(selectedOption.endDate).toString();
        if (
          shouldUpdateDate(startDate, selectedOption.startDate) ||
          shouldUpdateDate(endDate, selectedOption.endDate)
        ) {
          setStartDate(new Date(formatedStartDate));
          setEndDate(new Date(formatedEndDate));
        }
      } else {
        resetCustomDate();
      }
    } catch (error) {
      trackError(error);
    }
  };

  useEffect(() => {
    setSelectedValue(getDefaultOption(selectedOption));
    updateCustomDate();
  }, [selectedOption]);

  useEffect(() => {
    try {
      if (startDate && endDate && selectedValue.value === OPTIONS_OBJ.CUSTOM.value) {
        const customDateOption = getCustomDateOption({
          selectedValue,
          startDate,
          endDate,
          showDateTimePickerForCustom
        });
        setSelectedOption(customDateOption);
      }
    } catch (error) {
      trackError(error);
    }
  }, [startDate, endDate]);

  const setSelectedValues = (selectedValues: IOption[]): void => {
    try {
      if (!selectedValues?.length) {
        setSelectedValue(getDefaultOption(undefined));
        setSelectedOption({ ...getDefaultOption(undefined), startDate: '', endDate: '' });
        resetCustomDate();
        return;
      }
      setSelectedValue(selectedValues[0]);
      if (selectedValues[0].value !== OPTIONS_OBJ.CUSTOM.value) {
        setSelectedOption(getSelectedValueDateOption(selectedValues[0]));
      } else {
        onCustomOptionSelection?.();
      }
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <div className={`${styles.date_filter_wrapper} ${customStyleClass} date_filter_wrapper`}>
      <Dropdown
        fetchOptions={fetchOptions}
        selectedValues={[selectedValue]}
        setSelectedValues={setSelectedValues}
        hideClearButton={!showClearButton}
        showCheckIcon
        renderOnBody={renderOnBody}
        customContentStyleClass={customContentStyleClass}
        disableSearch
      />
      {selectedValue.value === OPTIONS_OBJ.CUSTOM.value ? (
        <RangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          renderOnBody={renderOnBody}
          showDateTimePickerForCustom={showDateTimePickerForCustom}
          resetOptionOnValueChange={resetOptionOnValueChange}
          includeSecondsForEndDate={includeSecondsForEndDate}
        />
      ) : null}
    </div>
  );
};

DateFilter.defaultProps = {
  showDateTimePickerForCustom: false,
  includeSecondsForEndDate: false,
  avoidUTCFormatting: false
};

export default DateFilter;
