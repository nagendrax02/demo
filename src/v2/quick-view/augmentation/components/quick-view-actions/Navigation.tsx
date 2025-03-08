import React, { ReactNode } from 'react';
import { GoTo } from 'assets/custom-icon/v2';
import styles from './quick-view-actions.module.css';
import { IconButton } from '@lsq/nextgen-preact/v2/button';

const Navigation = ({ onClick }: { onClick: () => void }): ReactNode => {
  return (
    <IconButton
      variant="tertiary-gray"
      size="sm"
      onClick={onClick}
      icon={<GoTo type="outline" className={styles.actions} />}
    />
  );
};

export default Navigation;
