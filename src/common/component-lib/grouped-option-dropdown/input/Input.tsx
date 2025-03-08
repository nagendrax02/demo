import { useEffect, useRef } from 'react';
import styles from './input.module.css';
import { GroupConfig, IGroupedOption } from '../grouped-option-dropdown.types';
import SelectedOptionRenderer from './SelectedOptionRenderer';

interface IInput {
  searchText: string;
  selectedOptions: IGroupedOption[];
  groupConfig: GroupConfig;
  onOptionClear: (option: IGroupedOption) => void;
  onInputChange: (input: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const Input = (props: IInput): JSX.Element => {
  const {
    searchText,
    selectedOptions,
    groupConfig,
    onOptionClear,
    onInputChange,
    placeholder,
    editable
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const getPlaceholderText = (): string | undefined => {
    if (!selectedOptions?.length && placeholder) {
      return placeholder;
    }
    return undefined;
  };

  // when there are no selected options, unset width to show placeholder
  const getInputWidth = (): string => (selectedOptions?.length ? '2px' : 'unset');

  useEffect(() => {
    // when selected options change, remove space occupied by input
    inputRef?.current?.style.setProperty('width', getInputWidth());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  const handleInputChange = (e): void => {
    if (inputRef?.current) {
      if (e?.target?.value?.length) {
        // increases width of input as needed, so input wont take up space of selected options
        inputRef?.current?.style.setProperty('width', `${e?.target?.value?.length + 1}ch`);
      } else {
        inputRef?.current?.style.setProperty('width', getInputWidth());
      }
    }
    onInputChange(e?.target?.value);
  };

  const handleFocus = (): void => {
    if (inputRef?.current) {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={`${styles.input_wrapper} grouped-input-wrapper`}
      onClick={handleFocus}
      onBlur={() => inputRef?.current?.style.setProperty('width', getInputWidth())}
      data-testid="grouped-option-dropdown-input">
      <div className={styles.option_wrapper} data-testid="grouped-option-dropdown-selected-option">
        <SelectedOptionRenderer
          options={selectedOptions}
          groupConfig={groupConfig}
          onOptionClear={onOptionClear}
        />
        {editable ? (
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            className={styles.input}
            onChange={handleInputChange}
            placeholder={getPlaceholderText()}
          />
        ) : null}
      </div>
    </div>
  );
};

Input.defaultProps = {
  placeholder: undefined,
  editable: true
};

export default Input;
