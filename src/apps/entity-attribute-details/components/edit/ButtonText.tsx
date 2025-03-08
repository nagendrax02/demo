import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './edit.module.css';

interface IButtonText {
  action: IActionWrapperItem;
}

const ButtonText = ({ action }: IButtonText): JSX.Element => {
  return (
    <>
      {action?.isLoading ? (
        <Shimmer
          key={action.id}
          className={styles.lead_details_edit_shimmer}
          dataTestId="action-shimmer"
        />
      ) : (
        action.title
      )}
    </>
  );
};

export default ButtonText;
