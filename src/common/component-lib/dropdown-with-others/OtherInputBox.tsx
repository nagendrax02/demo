import { IOtherOption } from './other.types';
import styles from './other.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Input = withSuspense(lazy(() => import('@lsq/nextgen-preact/input')));

const OtherInput = ({
  selectedValues,
  setSelectedValues
}: {
  selectedValues: IOtherOption[];
  setSelectedValues: (option: IOtherOption[]) => void;
}): JSX.Element => {
  const handleOtherText = (search: string): void => {
    const selectedOption = selectedValues?.[0];
    setSelectedValues([{ ...selectedOption, otherValue: search }]);
  };

  return (
    <div className={styles.other_input_wrapper}>
      <Input
        setValue={handleOtherText}
        value={selectedValues?.[0]?.otherValue}
        placeholder="Specify other"
        focusOnMount
        customStyleClass={styles.custom_input}
      />
    </div>
  );
};

export default OtherInput;
