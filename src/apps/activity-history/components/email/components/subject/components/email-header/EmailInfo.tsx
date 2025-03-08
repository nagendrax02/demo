import styles from './email-header.module.css';

interface IEmailInfo {
  label: string;
  title: string | JSX.Element | undefined;
  subTitle?: string | JSX.Element | undefined;
}

const EmailInfo = (props: IEmailInfo): JSX.Element | null => {
  const { label, title, subTitle } = props;
  if (!title) {
    return null;
  }
  return (
    <div className={styles.email_info}>
      <div className={`${styles.label} email-info-label`}>{label}</div>
      <div className={styles.value}>
        <span className={`${styles.title} email-info-title`}>{title}</span>
        {subTitle ? <span className={styles.subtitle}>{subTitle}</span> : null}
      </div>
    </div>
  );
};

EmailInfo.defaultProps = {
  subTitle: ''
};

export default EmailInfo;
