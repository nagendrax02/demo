import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useState } from 'react';
import IconButton from 'common/component-lib/icon-button';
import Icon from '@lsq/nextgen-preact/icon';
import styles from '../folder.module.css';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

export interface IEditFolder {
  folderName: string;
  setFolderName: React.Dispatch<React.SetStateAction<string>>;
  onSave: (newFolderName: string) => Promise<void> | void;
  onClear: () => Promise<void> | void;
  focus?: boolean;
}

const EditFolder = (props: IEditFolder): JSX.Element => {
  const { folderName, setFolderName, onSave, onClear, focus } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [folderNameInput, setFolderNameInput] = useState<string>(folderName);
  const { showAlert } = useNotification();

  const onFolderEdit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await onSave(folderNameInput);
      setFolderName(folderNameInput);
    } catch (err) {
      showAlert({
        type: Type.ERROR,
        message: err?.message ? `${err?.message}` : ERROR_MSG.generic
      });
      trackError(err);
    }
    setIsLoading(false);
  };
  return (
    <div className={`${styles.wrapper} ${styles.new_folder_input_wrapper}`}>
      <BaseInput
        value={folderNameInput}
        setValue={setFolderNameInput}
        focusOnMount={focus}
        customStyleClass={styles.new_folder_input}
      />

      <IconButton
        customStyleClass={styles.new_folder_save_button}
        onClick={onFolderEdit}
        icon={<Icon name="done" />}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <IconButton
        customStyleClass={styles.new_folder_clear_icon}
        onClick={async () => {
          await onClear();
        }}
        icon={<Icon name="close" />}
        disabled={isLoading}
      />
    </div>
  );
};

export default EditFolder;
