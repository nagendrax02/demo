import withSuspense from '@lsq/nextgen-preact/suspense';
import { useBulkUpdate } from '../bulk-update.store';
import { InputId } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { lazy } from 'react';

const PhoneNumberInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/phone-number')));

const BulkUpdatePhone = (): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleOnChange = (value): void => {
    setUpdateTo(value);
  };
  return (
    <div>
      <PhoneNumberInput
        onChange={handleOnChange}
        defaultCountryCode="+91"
        id={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        adjustHeight
        focusOnMount
        suspenseFallback={<Shimmer height="32px" width="100%" />}
      />
    </div>
  );
};

export default BulkUpdatePhone;
