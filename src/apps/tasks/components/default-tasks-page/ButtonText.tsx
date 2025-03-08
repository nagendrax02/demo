import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './default-tasks-page.module.css';

interface IButtonText {
  action: IActionWrapperItem;
}

const ButtonText = ({ action }: IButtonText): JSX.Element => {
  return (
    <>
      {action?.isLoading ? (
        <Shimmer key={action.id} dataTestId="action-shimmer" className={styles.add_task_shimmer} />
      ) : (
        action.title
      )}
    </>
  );
};

export default ButtonText;
