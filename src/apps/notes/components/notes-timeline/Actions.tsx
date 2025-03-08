import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import styles from './notes-timeline.module.css';
import { INotesItem } from '../../notes.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IAuthenticationConfig } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

interface IActions {
  data: INotesItem;
  handleEdit: () => void;
  handleDelete: () => void;
}

const Actions = (props: IActions): JSX.Element => {
  const { data, handleEdit, handleDelete } = props;

  const getUserId = (): string => {
    const { User: currentUser } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;
    const userId = currentUser?.Id;
    return userId;
  };

  return (
    <>
      {getUserId() === data?.CreatedBy ? (
        <>
          <div className={styles.notes_actions}>
            <Button
              text=""
              icon={<Icon name="edit" variant={IconVariant.Filled} />}
              onClick={handleEdit}
              dataTestId="notes-action-edit"
            />
            <Button
              text=""
              icon={<Icon name="delete" variant={IconVariant.Filled} />}
              onClick={handleDelete}
              dataTestId="notes-action-delete"
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Actions;
