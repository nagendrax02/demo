import { useBulkUpdate } from '../bulk-update.store';
import { IBulkUpdateField, InputId } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const EmailInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/email-input')));

const BulkUpdateEmail = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const updatedTo = useBulkUpdate((state) => state.updatedTo);
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleChange = (value: string, isValidEmail: boolean): void => {
    setUpdateTo({ value: value, isValidInput: isValidEmail });
  };

  return (
    <EmailInput
      value={updatedTo?.value}
      setValue={handleChange}
      placeholder="Enter Value"
      maxLength={(field?.maxLength as number) || 200}
      id={InputId.UpdateTo}
      error={error === InputId.UpdateTo}
      focusOnMount
      suspenseFallback={<Shimmer height="32px" width="100%" />}
    />
  );
};

export default BulkUpdateEmail;
