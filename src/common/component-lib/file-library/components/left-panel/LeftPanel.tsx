import { Docs, Image } from '../icons';
import { LibraryType } from '../../file-library.types';
import useFileLibraryStore from '../../file-library.store';
import SelectedFiles from './selected-files';
import styles from './left-panel.module.css';

const LeftPanel = (): JSX.Element => {
  const { library, setLibrarySelected, selectedFiles } = useFileLibraryStore((state) => ({
    library: state.library,
    setLibrarySelected: state.setLibrarySelected,
    selectedFiles: state.selectedFiles
  }));

  const icons = {
    [LibraryType.Documents]: <Docs />,
    [LibraryType.Images]: <Image />
  };

  const getClassName = (id: LibraryType): string => {
    const className = styles.category;
    if (library?.selected === id) return `${className} ${styles.category_active}`;
    return className;
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>Library</div>
        <div className={styles.category_container}>
          {library?.data?.map((data) => {
            return data.show ? (
              <div
                className={getClassName(data.id)}
                onClick={() => {
                  setLibrarySelected(data.id);
                }}
                role="button">
                {icons[data.id]}
                <div className={styles.category_name} title={data.label}>
                  {data.label}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
      {selectedFiles?.length ? <SelectedFiles /> : null}
    </>
  );
};

export default LeftPanel;
