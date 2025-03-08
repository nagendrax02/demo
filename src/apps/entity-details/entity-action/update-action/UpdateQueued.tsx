import styles from './Update.module.css';

const UpdateQueued = (): JSX.Element => {
  return (
    <div className={styles.update_queued}>
      Your bulk update request has been queued. You will be notified when the process is complete.
    </div>
  );
};

export default UpdateQueued;
