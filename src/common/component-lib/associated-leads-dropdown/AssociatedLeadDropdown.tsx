import { lazy, useState } from 'react';
import { IAssociatedLeadDropdown } from './associated-lead-dropdown.types';
import { fetchOptions } from './utils';
import styles from './associated-lead-dropdown.module.css';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const AssociatedLeadDropdown = (props: IAssociatedLeadDropdown): JSX.Element => {
  const {
    entityId,
    selectedLeadsArray,
    handleSelection,
    selectedValues,
    doNotSetDropdownValue,
    removedLeadsArray
  } = props;
  const [optionArrayLength, setOptionArrayLength] = useState<number>(0);
  const leadRepresentationName = getItem(
    StorageKey.LeadRepresentationName
  ) as IEntityRepresentationName;
  return (
    <div className={styles.associated_lead_container}>
      <Dropdown
        placeHolderText={`Search ${leadRepresentationName?.PluralName || 'Leads'} by name or email`}
        fetchOptions={(searchValue) =>
          fetchOptions({
            entityId,
            selectedLeadsArray,
            searchValue,
            setOptionArrayLength,
            removedLeadsArray
          })
        }
        setSelectedValues={handleSelection}
        selectedValues={selectedValues}
        doNotSetDropdownValue={doNotSetDropdownValue}
        refreshOptionsOnDropdownOpen
        renderConfig={optionArrayLength <= 3 ? { customMenuDimension: { height: 300 } } : {}}
      />
    </div>
  );
};

export default AssociatedLeadDropdown;
