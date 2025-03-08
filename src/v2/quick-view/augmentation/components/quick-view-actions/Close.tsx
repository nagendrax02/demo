import { ReactNode } from 'react';
import { Close as CloseIcon } from 'assets/custom-icon/v2';
import styles from './quick-view-actions.module.css';
import { IconButton } from '@lsq/nextgen-preact/v2/button';

const Close = ({ onClick }: { onClick: () => void }): ReactNode => {
  return (
    <IconButton
      onClick={onClick}
      size="sm"
      icon={<CloseIcon type="outline" className={styles.actions} />}
      variant="tertiary-gray"
    />
  );
};

export default Close;
