import Shimmer from '@lsq/nextgen-preact/shimmer';
import { getSelectedFieldValue, useBulkUpdate } from '../bulk-update.store';
import { IBulkUpdateField, InputId } from '../bulk-update.types';
import { NUMBER_LIMIT } from '../constant';
import { EntityType } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const NumberInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/number-input')));

const BulkUpdateNumber = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const updatedTo = useBulkUpdate((state) => state.updatedTo);
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleChange = (value: string): void => {
    const numberLimit =
      NUMBER_LIMIT[getSelectedFieldValue()?.initGridConfig?.entityType] ||
      NUMBER_LIMIT[EntityType.Lead];
    const number = Number(value);
    if (number >= numberLimit.Max) setUpdateTo({ value: `${numberLimit.Max}` });
    else if (number <= numberLimit.Min) setUpdateTo({ value: `${numberLimit.Min}` });
    else setUpdateTo({ value: value });
  };

  return (
    <div>
      <NumberInput
        value={updatedTo?.value}
        setValue={handleChange}
        forbidDecimal={field?.scale === 0}
        maxDigit={11}
        id={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        focusOnMount
        suspenseFallback={<Shimmer height="32px" width="100%" />}
        placeholder="Enter Value"
      />
    </div>
  );
};

export default BulkUpdateNumber;
