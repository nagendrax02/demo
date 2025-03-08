import { ICustomOption } from './quick-filter.types';
import styles from './quick-filter.module.css';
import { NON_EDITABLE_QUICK_FILTERS } from './constant';
import { IconButton } from '@lsq/nextgen-preact/v2/button';
import { Delete, Edit } from 'assets/custom-icon/v2';

const CustomOption = (props: ICustomOption): JSX.Element => {
  const { option, handleDelete, handleEdit } = props;

  const isQuickFilterEditable = (): boolean => {
    return !NON_EDITABLE_QUICK_FILTERS.includes(option?.InternalName ?? '');
  };

  return (
    <>
      <div className={styles.field_name}>{option.Name}</div>
      {isQuickFilterEditable() ? (
        <>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(option);
            }}
            title="modify"
            variant="tertiary-gray"
            size="xs"
            customStyleClass={styles.edit_delete_icon}
            icon={<Edit type="outline" />}
          />
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(option);
            }}
            title="delete"
            variant="tertiary-gray"
            size="xs"
            customStyleClass={styles.edit_delete_icon}
            icon={<Delete type="outline" />}
          />
        </>
      ) : null}
    </>
  );
};

export default CustomOption;
