import styles from './styles.module.css';

interface IAuditText {
  oldValue: string | undefined;
  newValue: string | undefined;
}

const AuditText = (props: IAuditText): JSX.Element => {
  const { oldValue, newValue } = props;

  return (
    <span>
      <span className={styles.bold}>{oldValue}</span> to{' '}
      <span className={styles.bold}>{newValue}</span>
    </span>
  );
};

export default AuditText;
