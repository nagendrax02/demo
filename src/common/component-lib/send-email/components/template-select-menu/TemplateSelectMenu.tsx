import { trackError } from 'common/utils/experience/utils/track-error';
import { lazy, useEffect, useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import styles from './template-select-menu.module.css';
import { IOption } from '../../send-email.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const BaseInput = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/base-input')));

export interface ITemplateSelectMenu {
  fetchOptions: (searchString: string) => Promise<IOption[]>;
  onOptionSelect: (option: IOption) => Promise<void>;
  selectedOption?: IOption;
}

const TemplateSelectMenu = ({
  fetchOptions,
  onOptionSelect,
  selectedOption
}: ITemplateSelectMenu): JSX.Element => {
  const [options, setOptions] = useState<IOption[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateOptions = async (): Promise<void> => {
    try {
      let response = await fetchOptions(searchText);
      response = response.filter(
        (opt) => opt.label?.toLowerCase().includes(searchText?.toLowerCase())
      );
      setOptions(response);
    } catch (err) {
      trackError(err);
    }
  };

  const updateSearchText = (newText: string): void => {
    setSearchText(newText);
  };

  useEffect(() => {
    const searchBar = document.getElementsByClassName('template-search-box')?.[0] as HTMLElement;
    if (searchBar) {
      (searchBar?.children?.[0] as HTMLElement)?.focus();
    }
  }, []);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      await updateOptions();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const getCheckIcon = (): JSX.Element | null => {
    return <Icon name="check" customStyleClass={styles.check_icon} />;
  };

  const getOptions = (): JSX.Element | JSX.Element[] => {
    if (isLoading) {
      return (
        <div className={`${styles.menu_option} ${styles.menu_loading}`}>
          <div className={styles.menu_option_loading}>Fetching Values</div>
        </div>
      );
    } else if (!options.length) {
      return (
        <div className={`${styles.menu_option} ${styles.menu_loading}`}>
          <div className={styles.menu_option_loading}>No results found</div>
        </div>
      );
    }
    return options.map((option) => {
      const isSelectedOption = option?.value === selectedOption?.value;
      return (
        <div
          className={`${styles.menu_option} ${isSelectedOption ? styles.selected_option : null}`}
          key={option?.value}
          onClick={async () => {
            await onOptionSelect(option);
          }}>
          <div className={styles.menu_option_label}>{option.label}</div>
          {isSelectedOption ? getCheckIcon() : null}
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.search_box} template-search-box`}>
        <BaseInput
          value={searchText}
          setValue={updateSearchText}
          placeholder="Templates"
          customStyleClass={styles.search_box_input}
        />
      </div>
      {getOptions()}
    </div>
  );
};

TemplateSelectMenu.defaultProps = {
  selectedOption: undefined
};

export default TemplateSelectMenu;
