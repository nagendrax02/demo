import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import styles from './component.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const RadioButton = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/radio')));

const BulkUpdateRadio = (): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);

  const onChange = (value: string): void => {
    setUpdateTo({ value });
  };

  return (
    <div className={styles.radio}>
      <RadioButton
        radioGroup="bulk-update"
        value="0"
        onChange={onChange}
        suspenseFallback={<Shimmer height="16px" width="16px" />}>
        No
      </RadioButton>
      <RadioButton
        radioGroup="bulk-update"
        value="1"
        onChange={onChange}
        suspenseFallback={<Shimmer height="16px" width="16px" />}>
        Yes
      </RadioButton>
    </div>
  );
};

export default BulkUpdateRadio;
