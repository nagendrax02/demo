import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useEffect, useRef, useState } from 'react';
import {
  GroupConfig,
  ICreateNewOptionConfig,
  IGroupedOption
} from './grouped-option-dropdown.types';
import styles from './grouped-option-dropdown.module.css';
import Input from './input';
import Menu from './menu';
import { debounce } from 'common/utils/helpers/helpers';
import withSuspense from '@lsq/nextgen-preact/suspense';

const DropdownRenderer = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown-renderer')));

export interface IGroupedOptionDropdown {
  selectedOptions: IGroupedOption[];
  fetchOptions?: (searchText?: string) => Promise<IGroupedOption[]>;
  onOptionSelect?: (option: IGroupedOption) => void;
  onOptionClear?: (option: IGroupedOption) => void;
  groupConfig: GroupConfig;
  placeholder?: string;
  minSearchCharacter?: number;
  customStyleClass?: string;
  editable?: boolean;
  removeGrouping?: boolean;
  customDropdownStyleClass?: string;
  swapOrientation?: boolean;
  stickyMenu?: boolean;
  createNewOptionConfig?: ICreateNewOptionConfig;
}

const GroupedOptionDropdown = (props: IGroupedOptionDropdown): JSX.Element => {
  const {
    selectedOptions,
    onOptionSelect,
    onOptionClear,
    groupConfig,
    placeholder,
    fetchOptions,
    minSearchCharacter = 0,
    customStyleClass,
    editable,
    removeGrouping,
    customDropdownStyleClass,
    swapOrientation,
    stickyMenu,
    createNewOptionConfig
  } = props;

  const [searchText, setSearchText] = useState<string>('');
  const [options, setOptions] = useState<IGroupedOption[]>([]);
  const [selectedOpts, setSelectedOpts] = useState<IGroupedOption[]>(selectedOptions);
  const [fetchingOptions, setFetchingOptions] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const debounceFetchOptions = useRef(fetchOptions ? debounce(fetchOptions) : null);

  useEffect(() => {
    setSelectedOpts(selectedOptions);
  }, [selectedOptions]);

  const handleSearchTextUpdate = (text: string): void => {
    if (text.length >= minSearchCharacter) {
      setShowMenu(true);
    }
    setSearchText(text);
  };

  const handleOptionClear = (clearedOption: IGroupedOption): void => {
    try {
      if (onOptionClear) onOptionClear(clearedOption);
      setSelectedOpts((prevOptions) => {
        const temp = [...prevOptions];
        const optionIndex = temp.findIndex((option) => option.value === clearedOption.value);
        if (optionIndex > -1) {
          temp.splice(optionIndex, 1);
        }
        return temp;
      });
    } catch (error) {
      trackError('Error while clearing option', error);
    }
  };

  const handleOptionSelect = (newOption: IGroupedOption): void => {
    try {
      if (onOptionSelect) onOptionSelect(newOption);
      setSelectedOpts((prevOptions) => {
        const temp = [...prevOptions];
        temp.push(newOption);
        return temp;
      });

      setShowMenu(false);
      setSearchText('');
    } catch (error) {
      trackError('Error while selecting option', error);
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      if (debounceFetchOptions.current && searchText?.length >= minSearchCharacter) {
        try {
          setFetchingOptions(true);
          const response = await debounceFetchOptions.current(searchText);
          setOptions(response);
        } catch (error) {
          trackError('Failed to fetch options', error);
        }
        setFetchingOptions(false);
      } else {
        setOptions([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <>
      <div
        ref={parentRef}
        className={`${styles.dropdown_wrapper} ${customStyleClass}`}
        data-testid="grouped-option-dropdown">
        <Input
          searchText={searchText}
          selectedOptions={selectedOpts}
          groupConfig={groupConfig}
          onInputChange={handleSearchTextUpdate}
          onOptionClear={handleOptionClear}
          placeholder={placeholder}
          editable={editable}
        />
      </div>
      {parentRef.current && showMenu ? (
        <DropdownRenderer
          parent={parentRef.current}
          onOutsideClick={() => {
            setSearchText('');
            setShowMenu(false);
          }}
          customStyleClass={customDropdownStyleClass}
          swapOrientation={swapOrientation}
          stickyMenu={stickyMenu}>
          <Menu
            searchText={searchText}
            options={options}
            groupConfig={groupConfig}
            onOptionSelect={handleOptionSelect}
            isOptionLoading={fetchingOptions}
            selectedOpts={selectedOpts}
            removeGrouping={removeGrouping}
            createNewOptionConfig={createNewOptionConfig}
          />
        </DropdownRenderer>
      ) : null}
    </>
  );
};

GroupedOptionDropdown.defaultProps = {
  placeholder: undefined,
  selectedOptions: undefined,
  minSearchCharacter: 0,
  fetchOptions: undefined,
  onOptionSelect: undefined,
  onOptionClear: undefined,
  customStyleClass: '',
  editable: true,
  removeGrouping: false,
  customDropdownStyleClass: '',
  swapOrientation: true,
  stickyMenu: false,
  createNewOptionConfig: undefined
};

export default GroupedOptionDropdown;
