import styles from './body-wrapper.module.css';

const BodyWrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
  return <div className={styles.body}>{children}</div>;
};

export default BodyWrapper;
