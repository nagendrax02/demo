import { CUSTOM_FILTER_STYLE_MAP } from '../../constants';
import { useEffect, useState } from 'react';
import { getAugmentedOptions, getTriggerState, removeCustomComponent } from '../../utils/utils';
import {
  IFilter,
  IFilterConfig
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import MultiSelect from '@lsq/nextgen-preact/v2/dropdown/multi-select';
import Trigger from '../trigger/Trigger';

export interface IMSWithoutSelectAll {
  defaultValues: IOption[];
  fetchOptions: (searchText?: string | undefined) => IOption[] | Promise<IOption[]>;
  onChange: (option: IOption[]) => void;
  filterLabel: string;
  isDisabled?: boolean;
  bySchemaName?: IFilterConfig;
  schemaName: string;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

const MSWithoutSelectAll = (props: IMSWithoutSelectAll): JSX.Element => {
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
  const [open, setOpen] = useState(false);
  const openByDefault = filters?.filterToOpenOnMount === schemaName;

  if (openByDefault && !open) {
    setOpen(true);
  }

  const parentSchemaName = schemaName && bySchemaName?.[schemaName]?.parentSchema;
  const triggerDropdownOptionsUpdate = parentSchemaName && bySchemaName?.[parentSchemaName]?.value;

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedOptions = await getAugmentedOptions(defaultValues, fetchOptions);
      setSelectedValues(augmentedOptions);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleOnChange = (options: IOption[]): void => {
    const updatedOptions = removeCustomComponent(options);
    setSelectedValues(updatedOptions);
    onChange?.(updatedOptions);
  };

  const handleOnOpen = (isOpen: boolean): void => {
    setOpen(isOpen);
    onOpenChange(isOpen);
  };

  return (
    <MultiSelect
      key={triggerDropdownOptionsUpdate}
      fetchOptions={fetchOptions}
      onSelection={handleOnChange}
      selectedOptions={selectedValues}
      open={open}
      onOpenChange={handleOnOpen}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      disabled={isDisabled}
      contentClassName={CUSTOM_FILTER_STYLE_MAP[schemaName ?? '']}>
      {({ internalSelectionMap }) => (
        <Trigger
          dropdownLabel={filterLabel}
          selectedOptions={Object.values(internalSelectionMap)}
          triggerState={getTriggerState(open, isDisabled)}
          onClear={() => {
            handleOnChange([]);
          }}
          disableTooltip={bySchemaName?.[schemaName].isDisabledTooltip}
        />
      )}
    </MultiSelect>
  );
};

MSWithoutSelectAll.defaultProps = {
  isDisabled: false,
  bySchemaName: {}
};

export default MSWithoutSelectAll;
