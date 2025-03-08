import AnimatedTick from './animated-tick';
import styles from './success-message.module.css';

export interface ISuccessMessage {
  message: string;
  description?: string;
  subDescription?: JSX.Element | string;
}

const SuccessMessage = (props: ISuccessMessage): JSX.Element => {
  const { message, description, subDescription } = props;

  return (
    <div className={`success-wrapper ${styles.wrapper}`}>
      <AnimatedTick />
      <div className={styles.message}>{message}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.description}>{subDescription}</div>
    </div>
  );
};

SuccessMessage.defaultProps = {
  description: undefined,
  subDescription: undefined
};

export default SuccessMessage;
