import { lazy, useState } from 'react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './component.module.css';
import { useBulkUpdate } from '../bulk-update.store';
import { getDropdownValue, getProductOption } from '../utils/dropdown-utils';
import { IBulkUpdateField, InputId, RenderTypeCode } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const BulkUpdateProduct = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const [selectedOption, setSelectedOption] = useState<IOption[]>();

  const handleOptionSelection = (data: IOption[]): void => {
    setSelectedOption(data);
    setUpdateTo({ value: getDropdownValue(data, ',') });
  };
  return (
    <div className={styles.owner_dd_wrapper}>
      <Dropdown
        fetchOptions={getProductOption}
        selectedValues={selectedOption}
        setSelectedValues={handleOptionSelection}
        inputId={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        isMultiselect={field?.renderType === RenderTypeCode.MultiSelect}
        removeSelectAll
        placeHolderText="Select"
        adjustHeight
        suspenseFallback={<Shimmer height="32px" width="100%" />}
      />
    </div>
  );
};

export default BulkUpdateProduct;
