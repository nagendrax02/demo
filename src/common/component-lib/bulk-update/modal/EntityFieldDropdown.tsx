import React, { lazy } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import { IBulkUpdateField, InputId } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const fetchOption = async (
  fields: IBulkUpdateField[] | null,
  searchText?: string
): Promise<IBulkUpdateField[]> => {
  if (searchText?.trim()) {
    return fields?.filter(
      (field) => field?.label?.toLowerCase().includes(searchText?.toLowerCase())
    ) as IBulkUpdateField[];
  }

  return fields as IBulkUpdateField[];
};

const EntityFieldDropdown = ({ fields }: { fields: IBulkUpdateField[] | null }): JSX.Element => {
  const { selectedField, setSelectedField, error } = useBulkUpdate((state) => ({
    selectedField: state.selectedField,
    setSelectedField: state.setSelectedField,
    error: state.error
  }));

  return (
    <Dropdown
      fetchOptions={(searchText: string) => fetchOption(fields, searchText)}
      setSelectedValues={setSelectedField}
      selectedValues={selectedField ? [selectedField] : undefined}
      showCheckIcon
      adjustHeight
      placeHolderText="Type to Search"
      inputId={InputId.SelectedField}
      error={error === InputId.SelectedField}
      suspenseFallback={<Shimmer height="32px" width="100%" />}
    />
  );
};

export default React.memo(EntityFieldDropdown);
