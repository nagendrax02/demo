import { useEffect, useState, lazy } from 'react';
import { IFile } from 'common/component-lib/file-library/file-library.types';
import Modal from '@lsq/nextgen-preact/modal';
import { CONSTANTS, INVALID_NAME_CHARS } from '../../../../constants';

import { Variant } from 'common/types';
import { getValidFileName } from '../../../../utils/common';
import styles from './actions.module.css';
import { getFileExtension } from 'common/component-lib/upload';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));
const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

interface IRenameFile {
  attachment: IFile;
  onRename: (selectedAttachment: IFile, newName: string) => void;
  onClose: () => void;
}

const RenameFile = (props: IRenameFile): JSX.Element => {
  const { attachment, onRename, onClose } = props;
  const [newName, setNewName] = useState<string>(getValidFileName(attachment.Name));
  const [error, setError] = useState<string | undefined>(undefined);

  const handleRename = (): void => {
    if (!newName) {
      setError('Filename is required');
    } else if (INVALID_NAME_CHARS.some((character) => newName.includes(character))) {
      setError('Special characters like < > * / % | ? are not allowed');
    } else {
      if (newName !== getValidFileName(attachment.Name)) {
        onRename(attachment, `${newName}.${getFileExtension(attachment.Name)}`);
      }
      onClose();
    }
  };

  useEffect(() => {
    setError(undefined);
  }, [newName]);

  return (
    <Modal show customStyleClass={styles.rename_action_modal}>
      <Modal.Header title={CONSTANTS.RENAME_FILE} onClose={onClose} />
      <Modal.Body>
        <div>
          <BaseInput
            setValue={setNewName}
            value={newName}
            customStyleClass={styles.rename_action_input}
          />
          {error ? <div className={styles.error_message}>{error}</div> : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button text={CONSTANTS.RENAME} onClick={handleRename} variant={Variant.Primary} />
          <Button text={CONSTANTS.CANCEL} onClick={onClose} variant={Variant.Secondary} />
        </>
      </Modal.Footer>
    </Modal>
  );
};

export default RenameFile;
