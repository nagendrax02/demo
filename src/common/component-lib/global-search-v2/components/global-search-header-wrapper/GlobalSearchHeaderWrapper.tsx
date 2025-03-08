import React, { ReactNode } from 'react';
import styles from './global-search-header-wrapper.module.css';
import { classNames } from 'common/utils/helpers/helpers';

interface IGlobalSearchHeaderWrapperProps {
  closeIcon: ReactNode;
  closeHandler: () => void;
  children: ReactNode;
}

const GlobalSearchHeaderWrapper: React.FC<IGlobalSearchHeaderWrapperProps> = ({
  closeIcon,
  closeHandler,
  children
}) => {
  return (
    <div className={styles.search_filters_wrapper}>
      {children}
      <button className={classNames(styles.icon_wrapper, 'unstyle_button')} onClick={closeHandler}>
        {closeIcon}
      </button>
    </div>
  );
};

export default GlobalSearchHeaderWrapper;
