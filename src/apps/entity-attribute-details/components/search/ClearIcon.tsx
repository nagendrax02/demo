import Icon from '@lsq/nextgen-preact/icon';
import styles from './search.module.css';

interface IClearIcon {
  onClick: () => void;
}

const ClearIcon = ({ onClick }: IClearIcon): JSX.Element => {
  return (
    <div onClick={onClick} data-testid="ead-clear-search">
      <Icon name="clear" customStyleClass={styles.clear_icon} />
    </div>
  );
};

export default ClearIcon;
