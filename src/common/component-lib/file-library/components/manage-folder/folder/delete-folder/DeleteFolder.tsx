import IconButton from 'common/component-lib/icon-button';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../folder.module.css';
import { CONSTANTS } from '../../constants';

export interface IEditFolder {
  onConfirm: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
}

const DeleteFolder = (props: IEditFolder): JSX.Element => {
  const { onConfirm, onCancel } = props;
  return (
    <div className={`${styles.wrapper} ${styles.new_folder_input_wrapper}`}>
      <div className={styles.delete_action_message}>{CONSTANTS.DELETE_MESSAGE}</div>
      <IconButton
        customStyleClass={styles.new_folder_save_button}
        onClick={async () => {
          await onConfirm();
        }}
        icon={<Icon name="done" />}
      />
      <IconButton
        customStyleClass={styles.new_folder_clear_icon}
        onClick={async () => {
          await onCancel();
        }}
        icon={<Icon name="close" />}
      />
    </div>
  );
};

export default DeleteFolder;
