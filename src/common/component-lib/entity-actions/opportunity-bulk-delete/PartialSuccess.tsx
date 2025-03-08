import { IEntityRepresentationName } from 'src/apps/entity-details/types/entity-data.types';
import styles from './style.module.css';
import { getRepName } from './utils';

const Count = ({ count }: { count: number }): JSX.Element => {
  return <span className={styles.partial_success_count}>{count}</span>;
};

const PartialSuccess = ({
  repName,
  partialMessage
}: {
  partialMessage: { successCount: number; failureCount: number };
  repName: IEntityRepresentationName;
}): JSX.Element => {
  const { failureCount, successCount } = partialMessage;
  return (
    <div className={styles.partial_success_message_wrapper}>
      <div className={styles.partial_success}>
        <Count count={successCount || 0} />{' '}
        {`${getRepName(repName, successCount)} updated successfully`}
      </div>
      <div className={styles.partial_failure}>
        <Count count={failureCount || 0} />{' '}
        {`${getRepName(repName, failureCount)} failed to update`}
      </div>
    </div>
  );
};

export default PartialSuccess;
