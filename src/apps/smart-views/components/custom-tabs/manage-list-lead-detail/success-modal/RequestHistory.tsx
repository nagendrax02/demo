import styles from './success-modal.module.css';

const RequestHistorySubDescription = (): JSX.Element => {
  return (
    <div>
      You can also view status In{' '}
      <a
        href="/Settings/RequestHistory"
        target="_blank"
        rel="noopener"
        className={styles.request_history_link}>
        Settings {'>'} Request History
      </a>
    </div>
  );
};

export default RequestHistorySubDescription;
