import React, { ReactNode } from 'react';
import styles from './global-search-body-wrapper.module.css';

interface IGlobalSearchBodyWrapperProps {
  children: ReactNode;
}

const GlobalSearchBodyWrapper: React.FC<IGlobalSearchBodyWrapperProps> = ({ children }) => {
  return <div className={styles.results_wrapper}>{children}</div>;
};

export default GlobalSearchBodyWrapper;
