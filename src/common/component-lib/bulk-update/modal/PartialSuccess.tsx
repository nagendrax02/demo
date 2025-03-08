import { useBulkUpdate } from '../bulk-update.store';
import styles from './modal.module.css';

const Count = ({ count }: { count: number }): JSX.Element => {
  return <span className={styles.partial_success_count}>{count}</span>;
};

const PartialSuccess = (): JSX.Element => {
  const partialSuccessMessage = useBulkUpdate((state) => state.partialSuccess);
  const { PluralName, SingularName } = useBulkUpdate((state) => state.representationName);
  return (
    <div className={styles.partial_success_message_wrapper}>
      <div className={styles.partial_success}>
        <Count count={partialSuccessMessage?.successCount || 0} />{' '}
        {`${
          (partialSuccessMessage?.successCount || 0) > 1 ? PluralName : SingularName
        } updated successfully`}
      </div>
      <div className={styles.partial_failure}>
        <Count count={partialSuccessMessage?.failureCount || 0} />{' '}
        {`${
          (partialSuccessMessage?.failureCount || 0) > 1 ? PluralName : SingularName
        } failed to update`}
      </div>
    </div>
  );
};

export default PartialSuccess;
