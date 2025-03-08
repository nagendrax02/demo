import { lazy, useCallback } from 'react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './associate-entity.module.css';
import { fetchAugmentedOptions, getSelectedValue } from './utils';
import { IAssociatedEntityDropdown } from './associated-entity.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const AssociatedEntity = (props: IAssociatedEntityDropdown): JSX.Element => {
  const {
    selectedValues,
    displayConfig,
    valueKey,
    openInNewTabHandler,
    fetchOptions,
    currentPrimaryContactId
  } = props;

  const handleFetchOption = useCallback(
    async (searchValue: string): Promise<IOption[]> => {
      const options = await fetchOptions(searchValue, currentPrimaryContactId);
      return fetchAugmentedOptions({ options, displayConfig, valueKey });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueKey]
  );

  return (
    <div className={styles?.wrapper}>
      <Dropdown
        {...props}
        selectedValues={getSelectedValue(
          displayConfig?.titleKeys,
          selectedValues,
          openInNewTabHandler
        )}
        fetchOptions={handleFetchOption}
        showCheckIcon
        removeSelectAll
        showCustomComponentAsLabel={!!selectedValues?.length}
        doNotSetDropdownValue
      />
    </div>
  );
};

export default AssociatedEntity;
