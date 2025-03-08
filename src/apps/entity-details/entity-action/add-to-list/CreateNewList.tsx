import styles from './add-to-list.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { CREATE_NEW_LIST, ICreateNewList } from './add-to-list.types';

const CreateNewList = (props: ICreateNewList): JSX.Element => {
  const { createNewListSelected, setCreateNewListSelected, handleSelection } = props;

  const handleSelect = (): void => {
    setCreateNewListSelected(true);
    handleSelection([CREATE_NEW_LIST]);
  };

  return (
    <div
      className={`${styles.create_container} ${
        !createNewListSelected ? styles.create_new_selected : ''
      }`}
      onClick={handleSelect}>
      <Icon name="add_box" variant={IconVariant.Filled} />

      <div className={styles.create_list_name_container}>
        <div className={styles.add_test}>Create New List</div>
        {createNewListSelected ? (
          <Icon dataTestId="check-icon" name="check" customStyleClass={styles.check} />
        ) : null}
      </div>
    </div>
  );
};

export default CreateNewList;
