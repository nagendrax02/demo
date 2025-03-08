import Icon from '@lsq/nextgen-preact/icon';
import { Variant } from 'common/types';
import useFileLibraryStore from '../../../file-library.store';
import styles from '../right-panel.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

const Footer = (): JSX.Element => {
  const { selectedFiles, onFilesSelect, setShow } = useFileLibraryStore((state) => ({
    selectedFiles: state.selectedFiles,
    onFilesSelect: state.onFilesSelect,
    setShow: state.setShow
  }));

  const onClick = (): void => {
    onFilesSelect?.(selectedFiles);
    setShow(false);
  };

  return (
    <div className={styles.footer}>
      <Button
        text="Cancel"
        variant={Variant.Secondary}
        onClick={() => {
          setShow(false);
        }}
        title="Cancel"
      />
      <Button
        text="Attach"
        variant={Variant.Primary}
        icon={<Icon name="attach_file" />}
        onClick={onClick}
        title="Attach"
      />
    </div>
  );
};

export default Footer;
