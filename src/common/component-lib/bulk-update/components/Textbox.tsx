import { lazy } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import { IBulkUpdateField, InputId } from '../bulk-update.types';
import styles from './component.module.css';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Input = withSuspense(lazy(() => import('@lsq/nextgen-preact/input')));

const Textbox = ({
  disabled,
  field
}: {
  field?: IBulkUpdateField;
  disabled?: boolean;
}): JSX.Element => {
  const updatedTo = useBulkUpdate((state) => state.updatedTo);
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleChange = (value: string): void => {
    setUpdateTo({ value: value });
  };

  return (
    <div className={styles.text_box_wrapper}>
      <Input
        value={updatedTo?.value}
        setValue={handleChange}
        placeholder="Enter Value"
        maxLength={(field?.maxLength as number) || 200}
        disabled={disabled}
        id={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        customStyleClass={styles?.text_box}
        focusOnMount
        suspenseFallback={<Shimmer height="32px" width="100%" />}
      />
    </div>
  );
};

Textbox.defaultProps = {
  disabled: false,
  field: undefined
};
export default Textbox;
