import { useState } from 'react';
import UserDropdown from 'common/component-lib/user-dropdown';
import { CallerSource } from 'common/utils/rest-client';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './component.module.css';
import { useBulkUpdate } from '../bulk-update.store';
import { getDropdownValue } from '../utils/dropdown-utils';
import { InputId } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const BulkUpdateOwner = (): JSX.Element => {
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const [selectedOption, setSelectedOption] = useState<IOption[]>();

  const handleOptionSelection = (data: IOption[]): void => {
    setSelectedOption(data);
    setUpdateTo({ value: getDropdownValue(data) });
  };
  return (
    <div className={styles.owner_dd_wrapper}>
      <UserDropdown
        callerSource={CallerSource.BulkUpdate}
        selectedValue={selectedOption}
        setSelectedValues={handleOptionSelection}
        inputId={InputId.UpdateTo}
        error={error === InputId.UpdateTo}
        adjustHeight
        suspenseFallback={<Shimmer height="32px" width="100%" />}
      />
    </div>
  );
};

export default BulkUpdateOwner;
