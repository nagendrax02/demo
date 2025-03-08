import StartDatePicker from './StartDatePicker';
import EndDatePicker from './EndDatePicker';
import styles from './range-picker.module.css';

export interface ICustomDatePicker {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  renderOnBody?: boolean;
  showDateTimePickerForCustom?: boolean;
  resetOptionOnValueChange?: boolean;
  includeSecondsForEndDate?: boolean;
}

const CustomDatePicker = (props: ICustomDatePicker): JSX.Element => {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    renderOnBody,
    showDateTimePickerForCustom,
    resetOptionOnValueChange,
    includeSecondsForEndDate
  } = props;

  return (
    <div
      className={`${styles.range_picker_wrapper} range-picker-wrapper`}
      data-testid="range-picker">
      <div className={`${styles.range_date_picker} range-picker`}>
        <StartDatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          renderOnBody={renderOnBody}
          showDateTimePickerForCustom={showDateTimePickerForCustom}
          resetOptionOnValueChange={resetOptionOnValueChange}
        />
        <EndDatePicker
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          renderOnBody={renderOnBody}
          showDateTimePickerForCustom={showDateTimePickerForCustom}
          resetOptionOnValueChange={resetOptionOnValueChange}
          includeSeconds={includeSecondsForEndDate}
        />
      </div>
    </div>
  );
};

CustomDatePicker.defaultProps = {
  renderOnBody: false,
  showDateTimePickerForCustom: false,
  resetOptionOnValueChange: false,
  includeSecondsForEndDate: false
};

export default CustomDatePicker;
