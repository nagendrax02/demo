import styles from './modal.module.css';

const BulkUpdateQueue = (): JSX.Element => {
  return (
    <div className={styles.bulk_update_queue}>
      Your bulk update request has been queued. You will be notified when the process is complete.
    </div>
  );
};

export default BulkUpdateQueue;
