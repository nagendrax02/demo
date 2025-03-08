import { useEffect, useState } from 'react';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { DEFAULT_OPP_TYPE_OPTION } from 'apps/smart-views/components/custom-tabs/lead-opportunity-tab/constants';
import { getAugmentedOptions } from './utils';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import Trigger from '../trigger/Trigger';
import { getTriggerState, removeCustomComponent } from '../../utils/utils';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface IOppTypeDropdown {
  defaultValues: IOption[];
  fetchOptions: (searchText?: string | undefined) => IOption[] | Promise<IOption[]>;
  onChange: (option: IOption[]) => void;
  filterLabel: string;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

const OppTypeDropdown = (props: IOppTypeDropdown): JSX.Element => {
  const { defaultValues, fetchOptions, onChange, filterLabel, schemaName, filters, onOpenChange } =
    props;
  const [selectedValues, setSelectedValues] = useState<IOption[]>(defaultValues);
  const [searchValue, setSearchValue] = useState<string>('');
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    const addLabels = async (): Promise<void> => {
      const augmentedOptions = await getAugmentedOptions(defaultValues, fetchOptions);
      setSelectedValues(augmentedOptions);
    };

    addLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleOnChange = (option: IOption | undefined): void => {
    const selectedOption = option ? [option] : [];
    const updatedSelectedOption = removeCustomComponent(selectedOption);
    setSelectedValues(updatedSelectedOption);
    onChange?.(updatedSelectedOption);
  };

  const handleFetchOptions = async (searchText: string): Promise<IOption[]> => {
    const options = await fetchOptions(searchText);
    return options;
  };

  const handleOnOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <SingleSelect
      fetchOptions={handleFetchOptions}
      selectedOption={selectedValues[0]}
      onSelection={handleOnChange}
      open={open}
      onOpenChange={handleOnOpen}
      searchValue={searchValue}
      onSearchChange={setSearchValue}>
      <Trigger
        dropdownLabel={filterLabel}
        selectedOptions={
          selectedValues?.[0]?.value === DEFAULT_OPP_TYPE_OPTION.value ? [] : selectedValues
        }
        triggerState={getTriggerState(open)}
        onClear={() => {
          handleOnChange(undefined);
        }}
      />
    </SingleSelect>
  );
};

export default OppTypeDropdown;
