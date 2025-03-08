import Icon from '@lsq/nextgen-preact/icon';
import styles from './styles.module.css';

const InvalidAudioURL = (): JSX.Element => {
  return (
    <div className={styles.warning_msg_wrapper}>
      <Icon name="warning" customStyleClass={styles.warning_icon} />
      <div className="warning-msg">Unable to retrieve audio</div>
    </div>
  );
};

export default InvalidAudioURL;
