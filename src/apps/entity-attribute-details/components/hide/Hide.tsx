import Checkbox from '@lsq/nextgen-preact/checkbox';
import styles from './hide.module.css';
import { useEntityAttributeDetailsStore } from '../../store/entity-attribute-details-store';

const Hide = (): JSX.Element => {
  const { setHideFields, hideFields } = useEntityAttributeDetailsStore();
  const handleCheck = (): void => {
    setHideFields(!hideFields);
  };
  return (
    <div className={styles.hide}>
      <Checkbox
        checked={hideFields}
        changeSelection={handleCheck}
        dataTestId={`hide-empty-fields-checkbox-${hideFields ? 'checked' : 'unchecked'}`}
      />
      <div className={styles.label} onClick={handleCheck}>
        Hide Empty Fields
      </div>
    </div>
  );
};

export default Hide;
