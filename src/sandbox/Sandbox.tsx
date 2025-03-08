/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* istanbul ignore file */
import styles from './sandbox.module.css';
import ManageFolder from '../common/component-lib/file-library/components/manage-folder';
import { useState, lazy } from 'react';
import { DUMMY_FOLDERS } from './constants';
import FileLibrary from 'common/component-lib/file-library';
import { CallerSource } from 'common/utils/rest-client';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const Sandbox = (): JSX.Element => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showFileLibrary, setShowFileLibrary] = useState<boolean>(false);

  return (
    <div className={styles.sandbox}>
      <h1>Sandbox</h1>
      <div className={styles.item}>
        <h3>File library</h3>
        <Button
          text="Open file library"
          onClick={() => {
            setShowFileLibrary(true);
          }}
        />
        {showFileLibrary ? (
          <FileLibrary
            setShow={setShowFileLibrary}
            onFilesSelect={() => {}}
            callerSource={CallerSource.NA}
          />
        ) : null}
      </div>
      <div className={styles.item}>
        <h3>Manage Folder</h3>
        <ManageFolder
          folders={DUMMY_FOLDERS}
          selectedFolder={selectedFolder}
          setSelectedFolder={(path) => {
            setSelectedFolder(path);
          }}
        />
      </div>
    </div>
  );
};

export default Sandbox;
