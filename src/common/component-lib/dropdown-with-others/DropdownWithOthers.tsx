import { lazy, useCallback } from 'react';
import { IDropdown, IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { OTHER_VALUE_KEY } from './constant';
import OtherInput from './OtherInputBox';
import styles from './other.module.css';
import { IOtherOption } from './other.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

export interface IDropdownWithOther extends IDropdown {
  selectedValues?: IOtherOption[];
  showOtherOption?: boolean;
}

const DropdownWithOthers = (props: IDropdownWithOther): JSX.Element => {
  const { fetchOptions, selectedValues, setSelectedValues, showOtherOption } = props;

  const fetchDDOption = useCallback(
    async (search: string): Promise<IOption[]> => {
      const options = (await fetchOptions(search)) || [];
      if (showOtherOption) {
        options?.push({ label: 'Others', value: OTHER_VALUE_KEY });
      }
      return options;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchOptions]
  );

  return (
    <div className={styles.dd_wrapper}>
      <Dropdown
        {...props}
        fetchOptions={fetchDDOption}
        placeHolderText="Select"
        removeSelectAll
        showCheckIcon
      />
      {selectedValues?.[0]?.value === OTHER_VALUE_KEY ? (
        <OtherInput selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
      ) : null}
    </div>
  );
};

DropdownWithOthers.defaultProps = {
  showOtherOption: true,
  selectedValues: undefined
};
export default DropdownWithOthers;
