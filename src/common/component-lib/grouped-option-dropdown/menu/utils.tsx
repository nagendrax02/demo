import { ICreateNewOptionConfig, IGroupedOption } from '../grouped-option-dropdown.types';
import styles from './menu.module.css';

const handlePlaceholderClick = (
  searchText: string,
  createNewOptionConfig: ICreateNewOptionConfig,
  onOptionSelect: (option: IGroupedOption) => void
): void => {
  const newOption = createNewOptionConfig?.getNewlyCreatedOption(searchText);
  onOptionSelect(newOption);
};

const getNewOptionPlaceholder = ({
  createNewOptionConfig,
  searchText,
  options,
  onOptionSelect,
  setEnableEnterKeyListener
}: {
  createNewOptionConfig: ICreateNewOptionConfig;
  searchText: string;
  options: IGroupedOption[];
  onOptionSelect: (option: IGroupedOption) => void;
  setEnableEnterKeyListener: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  if (createNewOptionConfig && createNewOptionConfig.canCreateNewOption(searchText, options)) {
    setEnableEnterKeyListener(true);
    return (
      <div
        className={`${styles.option}`}
        onClick={() => {
          handlePlaceholderClick(searchText, createNewOptionConfig, onOptionSelect);
        }}>
        <div className={`${styles.option_content} option-content`}>
          <div className={`${styles.option_label} option-label`}>
            {`Press Enter to create new ${createNewOptionConfig?.optionPlaceholder}`}
          </div>
          <div className={`${styles.option_secondary_label} option-secondary-label`}>
            {`(${searchText})`}
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export { getNewOptionPlaceholder, handlePlaceholderClick };
