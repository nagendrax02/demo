import { useEffect, useState } from 'react';
import { getAugmentedFetchOptions, getAugmentedOptions } from './utils';
import { ITaskTypeFilterOption } from '../../filter-renderer.types';
import MultiSelect from '@lsq/nextgen-preact/v2/dropdown/multi-select';
import Trigger from '../trigger/Trigger';
import { getTriggerState, removeCustomComponent } from '../../utils/utils';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface ITaskTypeDropdown {
  defaultValues: ITaskTypeFilterOption[];
  fetchOptions: (
    searchText?: string | undefined
  ) => ITaskTypeFilterOption[] | Promise<ITaskTypeFilterOption[]>;
  onChange: (option: ITaskTypeFilterOption[]) => void;
  filterLabel: string;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

const TaskTypeDropdown = (props: ITaskTypeDropdown): JSX.Element => {
  const { defaultValues, fetchOptions, onChange, filterLabel, schemaName, filters, onOpenChange } =
    props;
  const [selectedValues, setSelectedValues] = useState<ITaskTypeFilterOption[]>(defaultValues);
  const [searchValue, setSearchValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    async function addLabels(): Promise<void> {
      const augmentedOptions = await getAugmentedOptions(defaultValues, fetchOptions);
      setSelectedValues(augmentedOptions);
    }

    addLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleOnChange = (options: ITaskTypeFilterOption[]): void => {
    const updatedOptions = removeCustomComponent(options);
    setSelectedValues(updatedOptions);
    onChange?.(updatedOptions);
  };

  const handleFetchOptions = async (searchText: string): Promise<ITaskTypeFilterOption[]> => {
    const options = await fetchOptions(searchText);
    return getAugmentedFetchOptions(options);
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

export default TaskTypeDropdown;
