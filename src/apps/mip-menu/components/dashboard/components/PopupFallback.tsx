import styles from '../dashboard.module.css';
const PopupFallback = ({ message }: { message: string }): JSX.Element => {
  return <div className={`${styles.menu_container} ${styles.fetching}`}>{message}</div>;
};

export default PopupFallback;
