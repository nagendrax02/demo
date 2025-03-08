import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './user-dropdown.module.css';

const UserOption = (props: IOption): JSX.Element => {
  const { label, text } = props;

  return (
    <div className={styles.user_option_container}>
      <div className={styles.user_label}>{label}</div>
      <div className={styles.user_text}>{text}</div>
    </div>
  );
};

export default UserOption;
