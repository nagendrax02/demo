import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { useCallback, useEffect, useState } from 'react';
import {
  getAugmentedGroupedOptions,
  getTriggerState,
  removeCustomComponent
} from '../../utils/utils';
import MultiSelect from '@lsq/nextgen-preact/v2/dropdown/multi-select';
import Trigger from '../trigger/Trigger';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface IGroupedMSWithoutSelectAll {
  defaultValues: IOption[];
  fetchOptions: (searchText?: string | undefined) => IOption[] | Promise<IOption[]>;
  onChange: (option: IOption[]) => void;
  filterLabel: string;
  filters: IFilter;
  schemaName: string;
  onOpenChange: (isOpen: boolean) => void;
}

const GroupedMSWithoutSelectAll = (props: IGroupedMSWithoutSelectAll): JSX.Element => {
  const { defaultValues, fetchOptions, onChange, filterLabel, filters, schemaName, onOpenChange } =
    props;
  const [selectedValues, setSelectedValues] = useState<IOption[]>(defaultValues);
  const [searchValue, setSearchValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedOptions = await getAugmentedGroupedOptions(defaultValues, fetchOptions);
      setSelectedValues(augmentedOptions);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleFetchOptions = useCallback(async (searchText?: string): Promise<IOption[]> => {
    const options = await fetchOptions(searchText);
    return options?.map((option) => ({
      ...option,
      label: option.subOptions ? option.label?.toUpperCase() : option.label
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (options: IOption[]): void => {
    const updatedSelectedOption = removeCustomComponent(options);
    setSelectedValues(updatedSelectedOption);
    onChange?.(updatedSelectedOption);
  };

  const handleOnOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <MultiSelect
      fetchOptions={handleFetchOptions}
      onSelection={handleOnChange}
      selectedOptions={selectedValues}
      onOpenChange={handleOnOpen}
      open={open}
      searchValue={searchValue}
      onSearchChange={setSearchValue}>
      {({ internalSelectionMap }) => (
        <Trigger
          dropdownLabel={filterLabel}
          selectedOptions={Object.values(internalSelectionMap)}
          triggerState={getTriggerState(open)}
          onClear={() => {
            handleOnChange([]);
          }}
        />
      )}
    </MultiSelect>
  );
};

export default GroupedMSWithoutSelectAll;
