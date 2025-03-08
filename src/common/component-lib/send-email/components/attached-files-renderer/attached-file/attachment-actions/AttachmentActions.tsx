import IconButton from 'common/component-lib/icon-button';
import Icon from '@lsq/nextgen-preact/icon';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import ActionMenu from '@lsq/nextgen-preact/action-menu';
import styles from './actions.module.css';
import { IFile } from 'common/component-lib/file-library/file-library.types';
import { useState } from 'react';
import RenameFile from './RenameFile';

export interface IAttachmentActions {
  attachment: IFile;
  onRename: (selectedAttachment: IFile, newName: string) => void;
  onRemove: (selectedAttachment: IFile) => void;
}

const AttachmentActions = (props: IAttachmentActions): JSX.Element => {
  const { attachment, onRemove, onRename } = props;
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);

  const getMenuItems = (): IMenuItem[] => {
    return [
      {
        label: 'Rename',
        value: 'rename',
        clickHandler: (): void => {
          setShowRenameModal(true);
        }
      },
      {
        label: 'Remove',
        value: 'remove',
        clickHandler: (): void => {
          onRemove(attachment);
        }
      }
    ];
  };

  return (
    <>
      {showRenameModal ? (
        <RenameFile
          attachment={attachment}
          onRename={onRename}
          onClose={() => {
            setShowRenameModal(false);
          }}
        />
      ) : null}
      <ActionMenu actions={getMenuItems()} menuKey="1" customStyleClass={styles.action_menu}>
        <IconButton
          icon={<Icon name="more_horiz" />}
          onClick={() => {}}
          customStyleClass={styles.button}
        />
      </ActionMenu>
    </>
  );
};

export default AttachmentActions;
