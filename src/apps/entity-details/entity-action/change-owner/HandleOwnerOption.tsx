import { IResponseOption } from './change-owner.types';
import styles from './change-owner.module.css';

const HandleOwnerOption = (props: IResponseOption): JSX.Element => {
  const { label, text } = props;
  return (
    <div className={styles.custom_container}>
      <div className={styles.custom_container_label}>{label}</div>
      {text ? <div className={styles.custom_container_text}>{text}</div> : null}
    </div>
  );
};

export default HandleOwnerOption;
