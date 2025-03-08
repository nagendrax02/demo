import { Dispatch, lazy, SetStateAction, useState } from 'react';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './schedule-email.module.css';
import { CONSTANTS } from '../../constants';
import { Variant } from 'common/types';
import { LazyDateTimePicker } from 'common/component-lib/date-time';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { getTimezoneOptions } from 'common/constants/timezone-contants';
import { formatDateTime } from 'common/utils/helpers/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

export interface IScheduleEmail {
  setShow: Dispatch<SetStateAction<boolean>>;
  scheduleEmail: (dateTime: string) => void;
}

const ScheduleEmail = ({ setShow, scheduleEmail }: IScheduleEmail): JSX.Element => {
  const [dateTime, setDateTime] = useState<Date | undefined>();
  const [timezone, setTimezone] = useState<IOption[]>([]);
  const [error, setError] = useState<boolean>(false);

  const handleDate = (dateString: string): void => {
    setDateTime(new Date(dateString));
  };

  const handleScheduleClick = (): void => {
    if (dateTime && timezone.length) {
      const parsedDatedTime = formatDateTime(dateTime);
      scheduleEmail(`${parsedDatedTime} | ${timezone[0].value}`);
      setShow(false);
    } else {
      setError(true);
    }
  };

  return (
    <Modal show customStyleClass={styles.modal}>
      <Modal.Header
        title={CONSTANTS.SCHEDULE_EMAIL}
        onClose={() => {
          setShow(false);
        }}
      />
      <Modal.Body>
        <div className={styles.body}>
          <label className={styles.input_label}>Schedule On</label>
          <LazyDateTimePicker onChange={handleDate} value={dateTime} minDate={new Date()} />
          {error && !dateTime ? <div className={styles.error}>Schedule On is required</div> : null}
          <div className={styles.timezone}>
            <label className={styles.input_label}>Time Zone</label>
            <Dropdown
              fetchOptions={getTimezoneOptions}
              placeHolderText="Select"
              isMultiselect={false}
              selectedValues={timezone}
              setSelectedValues={setTimezone}
              renderConfig={{
                customMenuDimension: { height: 260 }
              }}
            />
            {error && !timezone.length ? (
              <div className={styles.error}>Time Zone is required</div>
            ) : null}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            text={CONSTANTS.CANCEL}
            variant={Variant.Secondary}
            onClick={() => {
              setShow(false);
            }}
          />
          <Button
            text={CONSTANTS.SCHEDULE}
            variant={Variant.Primary}
            onClick={handleScheduleClick}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleEmail;
