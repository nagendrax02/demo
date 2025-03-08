import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption, IDropdown } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import UserOption from './UserOption';
import { lazy, useCallback } from 'react';
import { userDataManager } from 'common/utils/entity-data-manager';
import { CallerSource } from 'common/utils/rest-client';
import { IUserOption, IUserOptionGroup } from 'common/types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

export interface IUserDropdown extends Omit<IDropdown, 'fetchOptions'> {
  selectedValue?: IOption[];
  setSelectedValues: (option: IOption[]) => void;
  callerSource: CallerSource;
  placeHolder?: string;
}

const UserDropdown = (props: IUserDropdown): JSX.Element => {
  const { selectedValue, setSelectedValues, placeHolder, callerSource } = props;

  const fetchOptions = useCallback(async (searchText: string): Promise<IOption[]> => {
    try {
      const options = await userDataManager.getDropdownOptions({
        searchText,
        callerSource
      });
      if (!options?.length) return [];

      return options?.map((option: IUserOption | IUserOptionGroup) => ({
        ...option,
        customComponent: (
          <UserOption
            label={option?.label as string}
            value={(option as IUserOption)?.value as string}
            text={(option as IUserOption)?.text as string}
          />
        )
      })) as IOption[];
    } catch (error) {
      trackError(error);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dropdown
      {...props}
      fetchOptions={fetchOptions}
      setSelectedValues={setSelectedValues}
      placeHolderText={placeHolder}
      selectedValues={selectedValue}
      removeSelectAll
    />
  );
};

UserDropdown.defaultProps = {
  placeHolder: 'Select',
  selectedValue: undefined
};

export default UserDropdown;
