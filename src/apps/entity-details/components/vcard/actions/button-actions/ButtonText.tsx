import { IButtonAction } from 'apps/entity-details/types/entity-data.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from '../actions.module.css';

interface IButtonText {
  action: IButtonAction;
}

const ButtonText = ({ action }: IButtonText): JSX.Element => {
  return (
    <>
      {action?.isLoading ? (
        <Shimmer
          key={action.id}
          className={styles.button_text_shimmer}
          dataTestId="action-shimmer"
        />
      ) : (
        action.title
      )}
    </>
  );
};

export default ButtonText;
