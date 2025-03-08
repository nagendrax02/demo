import { trackError } from 'common/utils/experience/utils/track-error';
import { LazyDatePicker, LazyDateTimePicker } from 'common/component-lib/date-time';
import styles from './range-picker.module.css';
import { PLACE_HOLDER_TEXT } from '../constants';

interface IStartDatePicker {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  renderOnBody?: boolean;
  showDateTimePickerForCustom?: boolean;
  resetOptionOnValueChange?: boolean;
}

const StartDatePicker = (props: IStartDatePicker): JSX.Element => {
  const {
    startDate,
    endDate,
    setStartDate,
    renderOnBody,
    showDateTimePickerForCustom,
    resetOptionOnValueChange
  } = props;

  const onChange = (data: string | null): void => {
    try {
      setStartDate(data ? new Date(data) : undefined);
    } catch (error) {
      trackError(error);
    }
  };

  return (
    <div
      className={`${styles.start_date_wrapper} ${
        showDateTimePickerForCustom ? styles.date_time_width : ''
      }`}
      data-testid="start-date-picker">
      {showDateTimePickerForCustom ? (
        <LazyDateTimePicker
          value={startDate}
          onChange={onChange}
          maxDate={endDate}
          renderOnBody={renderOnBody}
          hideError
          placeholders={{
            datePlaceholder: PLACE_HOLDER_TEXT.StartDate,
            timePlaceholder: PLACE_HOLDER_TEXT.StartTime
          }}
          resetOptionOnValueChange={resetOptionOnValueChange}
        />
      ) : (
        <LazyDatePicker
          value={startDate}
          onChange={onChange}
          maxDate={endDate}
          renderOnBody={renderOnBody}
          placeholderOnRender={PLACE_HOLDER_TEXT.StartDate}
          resetOptionOnValueChange={resetOptionOnValueChange}
        />
      )}
    </div>
  );
};

StartDatePicker.defaultProps = {
  renderOnBody: false,
  showDateTimePickerForCustom: false,
  resetOptionOnValueChange: false
};

export default StartDatePicker;
