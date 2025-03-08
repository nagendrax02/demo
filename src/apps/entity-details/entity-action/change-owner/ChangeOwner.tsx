import { IOwnerDropdown, IResponseOption } from './change-owner.types';
import { fetchOption } from './utils';
import styles from './change-owner.module.css';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const ChangeOwner = (props: IOwnerDropdown): JSX.Element => {
  const { setShowError, setSelectedOption, showError, selectedOption } = props;

  const handleSelection = (options: IResponseOption[]): void => {
    if (options.length) {
      setShowError(false);
      setSelectedOption([
        {
          value: options[0].value,
          label: options[0].label
        }
      ]);
    } else {
      setSelectedOption([]);
    }
  };

  return (
    <div
      className={`${styles.owner_dropdown_container} ${
        selectedOption?.length ? styles.border_style : ''
      }`}
      data-testid="owner-dropdown">
      <Dropdown
        fetchOptions={fetchOption}
        setSelectedValues={handleSelection}
        showCheckIcon
        placeHolderText="Select"
        error={showError}
        selectedValues={selectedOption}
      />
    </div>
  );
};

export default ChangeOwner;
