import { useState } from 'react';
import DropdownWithOthers, { OTHER_VALUE_KEY } from 'common/component-lib/dropdown-with-others';
import { getDropdownOption } from '../utils/dropdown-utils';
import { AugmentedRenderType, IBulkUpdateField, InputId } from '../bulk-update.types';
import { IOtherOption } from 'common/component-lib/dropdown-with-others';
import { useBulkUpdate } from '../bulk-update.store';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const BulkUpdateOtherDropdown = ({ field }: { field: IBulkUpdateField }): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<IOtherOption[]>();
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleOptionSelection = (data: IOtherOption[]): void => {
    setSelectedOption(data);

    setUpdateTo({
      value: data?.[0]?.value === OTHER_VALUE_KEY ? data[0].otherValue : data?.[0]?.value
    });
  };

  return (
    <DropdownWithOthers
      fetchOptions={(searchText: string) => getDropdownOption(field, searchText)}
      setSelectedValues={handleOptionSelection}
      selectedValues={selectedOption}
      inputId={InputId.UpdateTo}
      error={error === InputId.UpdateTo}
      adjustHeight
      suspenseFallback={<Shimmer height="32px" width="100%" />}
      showOtherOption={
        field?.augmentedRenderType === AugmentedRenderType?.DropdownWithOthers
          ? true
          : field?.includeLOSOtherOption
      }
    />
  );
};

export default BulkUpdateOtherDropdown;
