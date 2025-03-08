import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import styles from './user-dropdown.module.css';
import UserOption from './UserOption';
import { useCallback, useEffect, useState } from 'react';
import { getAugmentedUserOptions, getTriggerState, removeCustomComponent } from '../../utils/utils';
import {
  IFilter,
  IFilterConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IUserFilterOption } from '../../filter-renderer.types';
import MultiSelect from '@lsq/nextgen-preact/v2/dropdown/multi-select';
import SingleSelect from '@lsq/nextgen-preact/v2/dropdown/single-select';
import Trigger from '../trigger/Trigger';

export interface IUserDropdown {
  defaultValues: IOption[];
  fetchOptions: (
    searchText?: string | undefined
  ) => IUserFilterOption[] | Promise<IUserFilterOption[]>;
  onChange: (option: IOption[]) => void;
  filterLabel: string;
  isDisabled?: boolean;
  bySchemaName: IFilterConfig;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

const UserDropdown = (props: IUserDropdown): JSX.Element => {
  const {
    defaultValues,
    fetchOptions,
    onChange,
    filterLabel,
    isDisabled,
    bySchemaName,
    schemaName,
    filters,
    onOpenChange
  } = props;
  const [selectedValues, setSelectedValues] = useState<IOption[]>(defaultValues);
  const [searchValue, setSearchValue] = useState<string>('');
  const isSingleSelect = bySchemaName?.[schemaName ?? '']?.isUserSingleSelect;
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedOptions = await getAugmentedUserOptions(defaultValues);
      setSelectedValues(augmentedOptions);
    })();
  }, [defaultValues]);

  const handleFetchOptions = useCallback(async (searchText: string): Promise<IOption[]> => {
    const options = await fetchOptions(searchText);
    return options?.map((option) => ({
      ...option,
      customComponent: (
        <UserOption label={option?.label} value={option?.value} text={option?.text} />
      )
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (options: IOption[]): void => {
    const updatedOptions = removeCustomComponent(options);
    setSelectedValues(updatedOptions);
    onChange?.(updatedOptions);
  };

  const getTrigger = (selectionOptions: IOption[]): JSX.Element => {
    return (
      <Trigger
        dropdownLabel={filterLabel}
        selectedOptions={selectionOptions}
        triggerState={getTriggerState(open, isDisabled)}
        onClear={() => {
          handleOnChange([]);
        }}
      />
    );
  };

  const handleOnOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <>
      {isSingleSelect ? (
        <SingleSelect
          fetchOptions={handleFetchOptions}
          onSelection={(option: IOption | undefined) => {
            handleOnChange(option ? [option] : []);
          }}
          selectedOption={selectedValues[0]}
          contentClassName={styles.user_filter}
          open={open}
          onOpenChange={handleOnOpen}
          searchValue={searchValue}
          disabled={isDisabled}
          onSearchChange={setSearchValue}>
          {getTrigger(selectedValues)}
        </SingleSelect>
      ) : (
        <MultiSelect
          fetchOptions={handleFetchOptions}
          onSelection={handleOnChange}
          selectedOptions={selectedValues}
          contentClassName={styles.user_filter}
          open={open}
          onOpenChange={handleOnOpen}
          searchValue={searchValue}
          disabled={isDisabled}
          onSearchChange={setSearchValue}>
          {({ internalSelectionMap }) => getTrigger(Object.values(internalSelectionMap))}
        </MultiSelect>
      )}
    </>
  );
};

UserDropdown.defaultProps = {
  isDisabled: false
};

export default UserDropdown;
