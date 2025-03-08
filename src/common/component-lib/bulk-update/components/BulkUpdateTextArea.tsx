import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import { IBulkUpdateField, InputId } from '../bulk-update.types';
import styles from './component.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const BulkUpdateTextArea = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const updatedTo = useBulkUpdate((state) => state.updatedTo);
  const error = useBulkUpdate((state) => state.error);
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);

  const handleChange = (e): void => {
    setUpdateTo({ value: e?.target?.value as string });
  };

  return (
    <div className={styles.text_area_wrapper}>
      <TextArea
        message={updatedTo?.value}
        handleMessageChange={handleChange}
        placeholder={'Enter Value'}
        maxLength={(field?.maxLength as number) || 2000}
        id={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        focusOnMount
        suspenseFallback={<Shimmer height="100px" width="100%" />}
      />
    </div>
  );
};

export default BulkUpdateTextArea;
