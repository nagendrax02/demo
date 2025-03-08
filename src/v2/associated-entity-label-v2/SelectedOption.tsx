import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './entity-label.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { getTitle } from './utils';

const SelectedOption = ({
  selectedOption,
  titleKeys,
  openInNewTabHandler
}: {
  titleKeys: string[];
  selectedOption?: IOption;
  openInNewTabHandler?: <T>(data?: T) => void;
}): React.ReactNode => {
  if (!selectedOption) return null;

  const title = getTitle({ titleKeys, config: selectedOption });

  return (
    <button
      className={`${styles?.selected_option_wrapper} ${
        openInNewTabHandler ? styles?.cursor_pointer : ''
      }`}
      onClick={(e) => {
        e?.stopPropagation();
        if (openInNewTabHandler) openInNewTabHandler(selectedOption);
      }}>
      <div className={styles?.selected_option_label} title={title}>
        {title}
      </div>

      {openInNewTabHandler ? (
        <Icon name="open_in_new" customStyleClass={styles?.selected_option_icon} />
      ) : (
        ''
      )}
    </button>
  );
};

SelectedOption.defaultProps = {
  selectedOption: undefined,
  openInNewTabHandler: undefined
};

export default SelectedOption;
