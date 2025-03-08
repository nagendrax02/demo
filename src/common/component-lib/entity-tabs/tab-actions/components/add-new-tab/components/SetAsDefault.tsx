import Checkbox from '@lsq/nextgen-preact/checkbox';
import styles from '../add-new-tab.module.css';
import useAddNewTab from '../add-new-tab-store';

const SetAsDefault = (): JSX.Element => {
  const setIsDefault = useAddNewTab((state) => state?.setIsDefault);
  const isDefault = useAddNewTab((state) => state?.isDefault);

  return (
    <div className={styles.set_default}>
      <Checkbox
        checked={isDefault}
        changeSelection={setIsDefault}
        dataTestId="add-new-tab-set-default"
      />{' '}
      Set as Default Tab
    </div>
  );
};

export default SetAsDefault;
