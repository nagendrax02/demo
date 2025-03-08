import { BasicEditor } from 'common/component-lib/editor';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { useBulkUpdate } from '../bulk-update.store';
import styles from './component.module.css';
import { IBulkUpdateField } from '../bulk-update.types';

const BulkUpdateEditor = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const updatedTo = useBulkUpdate((state) => state.updatedTo);
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);

  const handleChange = (value: string): void => {
    setUpdateTo({ value });
  };
  return (
    <div className={styles.editor_wrapper}>
      <BasicEditor
        value={updatedTo?.value}
        onValueChange={handleChange}
        placeholderText="Enter Value"
        maxCharLimit={(field?.maxLength as number) || 2000}
        suspenseFallback={<Shimmer height="100px" width="100%" />}
      />
    </div>
  );
};

export default BulkUpdateEditor;
