import { IFile, LibraryType } from 'common/component-lib/file-library/file-library.types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import Actions from './Actions';
import Thumbnail from './Thumbnail';
import FileDetails from './FileDetails';
import styles from './card.module.css';

interface ICard {
  file: IFile;
  libraryType: LibraryType | null;
  selectedFiles: IFile[];
  disabledFiles: boolean;
  maxFiles: number;
  handlePreview: (file: IFile) => void;
  handleDelete: (file: IFile) => void;
  handleAdd: (file: IFile) => void;
  handleAbort: (file: IFile) => void;
}

const Card = ({
  file,
  libraryType,
  selectedFiles,
  disabledFiles,
  maxFiles,
  handlePreview,
  handleDelete,
  handleAdd,
  handleAbort
}: ICard): JSX.Element => {
  const isFileSelected = (): boolean => {
    return selectedFiles?.some((selectedFile) => selectedFile?.Path === file?.Path) || false;
  };

  const isFileDisabled = (): boolean => {
    return (disabledFiles && !isFileSelected()) || false;
  };

  const Checkbox = (): JSX.Element => (
    <span className={`${styles.checkbox} ${isFileSelected() ? styles.checkbox_selected : ''}`}>
      <Icon name="check_box" variant={IconVariant.Filled} />
    </span>
  );

  const AbortUpload = (): JSX.Element => {
    return (
      <span
        className={styles.close_icon_wrapper}
        onClick={() => {
          handleAbort(file);
        }}
        role="button"
        tabIndex={0}>
        <Icon name="close_Sharp" variant={IconVariant.Filled} />
      </span>
    );
  };

  const handlePreviewClick = (): void => {
    handlePreview(file);
  };

  const handleDeleteClick = (): void => {
    handleDelete(file);
  };

  const handleAddClick = (): void => {
    if (isFileDisabled()) return;
    handleAdd(file);
  };

  const getClassNames = (): string => {
    let classNames = styles.card;
    if (isFileDisabled()) classNames = `${classNames} ${styles.disabled}`;
    return classNames;
  };

  const getTitle = (): string => {
    if (isFileDisabled()) return `Maximum selection limit of ${maxFiles} Files is reached.`;
    return '';
  };

  return (
    <div key={file.Id} className={getClassNames()} onClick={handleAddClick} title={getTitle()}>
      {file.Path ? (
        <>
          <Checkbox />
          <Actions handlePreview={handlePreviewClick} handleDelete={handleDeleteClick} />
        </>
      ) : (
        <AbortUpload />
      )}
      <Thumbnail
        name={file.Name}
        path={file.Path}
        extension={file.Extension}
        libraryType={libraryType}
      />
      <FileDetails
        name={file.Name}
        size={file.Size}
        extension={file.Extension}
        isFileSelected={isFileSelected()}
      />
    </div>
  );
};

export default Card;
