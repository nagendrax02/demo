import React from 'react';
import styles from './results-loader.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const ResultsLoader: React.FC = () => {
  const loaderItems = [1, 2, 3];

  return (
    <div className={styles.loader_container}>
      {loaderItems.map((item) => (
        <Shimmer key={item} height="60px" className={styles.loader} />
      ))}
    </div>
  );
};

export default ResultsLoader;
