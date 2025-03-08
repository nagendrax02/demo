import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import useFileLibraryStore from '../../../file-library.store';
import styles from './card.module.css';

interface IActions {
  handlePreview: () => void;
  handleDelete: () => void;
}

const Actions = ({ handlePreview, handleDelete }: IActions): JSX.Element => {
  const showDeleteButton = useFileLibraryStore((state) => {
    const selectedLibraryData = state.library.data.filter(
      (item) => item.id === state.library.selected
    );
    return selectedLibraryData[0]?.showDeleteButton ?? true;
  });

  const handlePreviewClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    event.stopPropagation();
    handlePreview();
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {
    event.stopPropagation();
    handleDelete();
  };

  return (
    <>
      <span
        onClick={handlePreviewClick}
        title="Preview"
        role="button"
        tabIndex={0}
        className={`${styles.action_icons} ${
          !showDeleteButton ? 'preview-icon-wrapper' : ''
        } action-icons`}>
        <Icon
          name="visibility"
          variant={IconVariant.Filled}
          customStyleClass={styles.visibility_icon}
        />
      </span>
      {showDeleteButton ? (
        <span
          className={`${styles.action_icons} ${styles.delete_icon_wrapper} action-icons`}
          onClick={handleDeleteClick}
          role="button"
          tabIndex={0}
          title="Delete">
          <Icon
            name="delete"
            variant={IconVariant.Outlined}
            customStyleClass={styles.delete_icon}
          />
        </span>
      ) : null}
    </>
  );
};

export default Actions;
