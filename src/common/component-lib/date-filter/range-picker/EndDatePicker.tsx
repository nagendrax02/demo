import { trackError } from 'common/utils/experience/utils/track-error';
import { LazyDateTimePicker, LazyDatePicker } from 'common/component-lib/date-time';
import styles from './range-picker.module.css';
import { PLACE_HOLDER_TEXT } from '../constants';

interface IEndDatePicker {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  renderOnBody?: boolean;
  showDateTimePickerForCustom?: boolean;
  resetOptionOnValueChange?: boolean;
  includeSeconds?: boolean;
}

const EndDatePicker = (props: IEndDatePicker): JSX.Element => {
  const {
    startDate,
    endDate,
    setEndDate,
    renderOnBody,
    showDateTimePickerForCustom,
    resetOptionOnValueChange,
    includeSeconds
  } = props;

  const getSecondsData = (date: Date): number => {
    return date?.getSeconds() > 0 ? date?.getSeconds() : 59;
  };

  const onChange = (data: string | null): void => {
    try {
      const newDate = data ? new Date(data) : undefined;
      if (newDate && includeSeconds) {
        const seconds = getSecondsData(newDate);
        newDate.setSeconds(seconds);
      }
      setEndDate(newDate);
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <div
      className={`${styles.end_date_wrapper} ${
        showDateTimePickerForCustom ? styles.date_time_width : ''
      }`}
      data-testid="end-date-picker">
      {showDateTimePickerForCustom ? (
        <LazyDateTimePicker
          value={endDate}
          onChange={onChange}
          minDate={startDate}
          renderOnBody={renderOnBody}
          hideError
          placeholders={{
            datePlaceholder: PLACE_HOLDER_TEXT.EndDate,
            timePlaceholder: PLACE_HOLDER_TEXT.EndTime
          }}
          resetOptionOnValueChange={resetOptionOnValueChange}
        />
      ) : (
        <LazyDatePicker
          value={endDate}
          onChange={onChange}
          minDate={startDate}
          renderOnBody={renderOnBody}
          placeholderOnRender={PLACE_HOLDER_TEXT.EndDate}
          resetOptionOnValueChange={resetOptionOnValueChange}
        />
      )}
    </div>
  );
};

EndDatePicker.defaultProps = {
  renderOnBody: false,
  showDateTimePickerForCustom: false,
  resetOptionOnValueChange: false,
  includeSeconds: false
};

export default EndDatePicker;
