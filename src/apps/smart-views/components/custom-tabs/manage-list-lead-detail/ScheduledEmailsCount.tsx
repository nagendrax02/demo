import EmailSchedule from 'assets/custom-icon/v2/EmailSchedule';
import styles from './manage-list-lead-detail.module.css';
import { useEffect, useState } from 'react';
import { getScheduledEmailCount } from '../utils';
import { CallerSource } from 'common/utils/rest-client';
import { getListId } from 'common/utils/helpers/helpers';
import useSendEmailStore from 'common/component-lib/send-email/send-email.store';

const ScheduledEmailCount = (): JSX.Element => {
  const [scheduledEmailsCount, setScheduledEmailsCount] = useState(0);
  const { updateScheduleEmailCount } = useSendEmailStore();

  useEffect(() => {
    (async (): Promise<void> => {
      const listId = getListId() as string;
      const response = await getScheduledEmailCount({
        listIds: [listId],
        callerSource: CallerSource.ListDetails
      });
      const count = response[listId];
      setScheduledEmailsCount(count);
    })();
  }, [updateScheduleEmailCount]);

  const getCount = (): string | number => {
    if (scheduledEmailsCount > 9) {
      return `${9}+`;
    }
    return scheduledEmailsCount;
  };

  return (
    <div className={styles.scheduled_email_count_container}>
      <div className={styles.scheduled_email_count}>{getCount()}</div>
      <EmailSchedule
        type="outline"
        className={`${styles.view_scheduled_email_icon} ${styles.third_nested}`}
      />
    </div>
  );
};

export default ScheduledEmailCount;
