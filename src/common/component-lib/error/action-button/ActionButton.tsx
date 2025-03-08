import Button from '../../button';
import { IActionButton } from '../error.types';
import styles from './action-button.module.css';

const ActionButton = (props: IActionButton): JSX.Element => {
  const { actionConfig } = props;

  return (
    <div className={styles.action_button}>
      <Button
        text={actionConfig?.title}
        onClick={actionConfig?.handleClick}
        dataTestId="error-action"
      />
    </div>
  );
};

export default ActionButton;
