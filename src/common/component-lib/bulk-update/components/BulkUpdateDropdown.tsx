import { lazy, useState } from 'react';
import { AugmentedRenderType, IBulkUpdateField, InputId } from '../bulk-update.types';
import { getDropdownOption, getDropdownValue } from '../utils/dropdown-utils';
import dropdownStyle from '../modal/modal.module.css';
import { useBulkUpdate } from '../bulk-update.store';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { withShimmer } from './withShimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const BulkUpdateOtherDropdown = withShimmer(
  withSuspense(lazy(() => import('./BulkUpdateOtherDropdown')))
);

const BulkUpdateDropdown = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const [selectedOption, setSelectedOption] = useState<IBulkUpdateField[]>();

  const handleOptionSelection = (data: IBulkUpdateField[]): void => {
    setSelectedOption(data);
    setUpdateTo({ value: getDropdownValue(data) });
  };

  if (field?.includeLOSOtherOption) {
    return <BulkUpdateOtherDropdown field={field} />;
  }
  return (
    <div className={dropdownStyle.dropdown_wrapper}>
      <Dropdown
        fetchOptions={(searchText: string) => getDropdownOption(field, searchText)}
        setSelectedValues={handleOptionSelection}
        selectedValues={selectedOption}
        isMultiselect={field?.augmentedRenderType === AugmentedRenderType.MultiselectDropdown}
        disableSearch={
          field?.augmentedRenderType !== AugmentedRenderType.MultiselectDropdown &&
          field?.augmentedRenderType !== AugmentedRenderType.SearchableDropDown
        }
        adjustHeight
        placeHolderText="Select"
        removeSelectAll
        showCheckIcon={field?.augmentedRenderType !== AugmentedRenderType.MultiselectDropdown}
        inputId={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        suspenseFallback={<Shimmer height="32px" width="100%" />}
      />
    </div>
  );
};

BulkUpdateDropdown.defaultProps = {
  searchable: false,
  selectDropdown: false,
  multiSelectDropdown: false
};

export default BulkUpdateDropdown;
