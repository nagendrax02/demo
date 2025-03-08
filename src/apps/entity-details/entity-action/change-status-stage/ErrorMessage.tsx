import styles from './change-status-stage.module.css';

const ErrorMessage = ({ message }: { message: string }): JSX.Element => {
  return <div className={styles.error_message}>{message}</div>;
};

export default ErrorMessage;
