import Checkbox from '@lsq/nextgen-preact/checkbox';
import { IOption } from '../../send-email.types';
import styles from './email-select-menu.module.css';
import { useEffect } from 'react';

export interface IEmailSelectMenu {
  options: IOption[];
  onOptionSelect: (option: IOption, selected: boolean) => void;
  selectedOptions?: IOption[];
}

const EmailSelectMenu = ({
  options,
  selectedOptions,
  onOptionSelect
}: IEmailSelectMenu): JSX.Element => {
  const handleOptionsSelect = (option: IOption, selected: boolean): void => {
    onOptionSelect(option, selected);
  };

  useEffect(() => {
    const selectedOpt = document.getElementsByClassName('checked-email-field');
    if (selectedOpt?.length) {
      selectedOpt[0].scrollIntoView(true);
    }
  }, []);

  const getOptions = (): JSX.Element[] => {
    return options?.map((option) => {
      const isOptionChecked = selectedOptions
        ? selectedOptions.findIndex((opt) => opt.value === option.value) > -1
        : false;

      return (
        <div
          className={`${styles.menu_option} ${isOptionChecked ? 'checked-email-field' : null}`}
          key={option.value}>
          <Checkbox
            checked={isOptionChecked}
            customStyleClass={styles.menu_option_checkbox}
            changeSelection={(selected: boolean) => {
              handleOptionsSelect(option, selected);
            }}
          />
          <div className={styles.menu_option_label}>{option.label}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.menu_container}>
      <div className={styles.menu_title}>{`Send to Email Field(s)`}</div>
      {getOptions()}
    </div>
  );
};

EmailSelectMenu.defaultProps = {
  selectedOptions: undefined
};

export default EmailSelectMenu;
