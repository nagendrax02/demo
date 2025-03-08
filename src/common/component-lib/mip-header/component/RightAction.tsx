import { rightActions } from '../constant';
import Action from './Action';
import styles from '../mip-header.module.css';

const RightAction = (): JSX.Element => {
  return (
    <div className={styles.action_wrapper}>
      {rightActions.map((action) => (
        <Action key={action.id} action={action} />
      ))}
    </div>
  );
};

export default RightAction;
