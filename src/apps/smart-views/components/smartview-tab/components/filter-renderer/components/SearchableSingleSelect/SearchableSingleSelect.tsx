import { useEffect, useState } from 'react';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import Trigger from '../trigger/Trigger';
import { getTriggerState, removeCustomComponent } from '../../utils/utils';
import { IFilter } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

interface ISearchableSingleSelect {
  defaultValues: IOption[];
  fetchOptions: (searchText?: string | undefined) => Promise<IOption[]>;
  onChange: (option: IOption[]) => void;
  filterLabel: string;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

const SearchableSingleSelect = (props: ISearchableSingleSelect): JSX.Element => {
  const { defaultValues, fetchOptions, onChange, filterLabel, schemaName, filters, onOpenChange } =
    props;
  const [selectedValues, setSelectedValues] = useState<IOption[]>(defaultValues);
  const [searchText, setSearchText] = useState<string>('');
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    setSelectedValues(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleOnChange = (option: IOption | undefined): void => {
    const selectedOption = option ? [option] : [];
    const updatedSelectedOption = removeCustomComponent(selectedOption);
    setSelectedValues(updatedSelectedOption);
    onChange?.(updatedSelectedOption);
  };

  const handleFetchOptions = async (searchValue: string): Promise<IOption[]> => {
    const options = await fetchOptions(searchValue);
    return options;
  };

  const handleOnOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <SingleSelect
      fetchOptions={handleFetchOptions}
      onSelection={handleOnChange}
      selectedOption={selectedValues[0]}
      open={open}
      onOpenChange={handleOnOpen}
      searchValue={searchText}
      onSearchChange={setSearchText}>
      <Trigger
        dropdownLabel={filterLabel}
        selectedOptions={selectedValues}
        triggerState={getTriggerState(open)}
        onClear={() => {
          handleOnChange(undefined);
        }}
      />
    </SingleSelect>
  );
};

export default SearchableSingleSelect;
