import { useCallback } from 'react';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchOption } from './utils';
import { IAssociatedAccount } from './associated-account.types';
import AssociatedEntity from '../associated-entity/AssociatedEntity';

const AssociatedAccount = (props: IAssociatedAccount): JSX.Element => {
  const { callerSource, accountTypeId } = props;

  const handleFetchOption = useCallback(
    async (searchValue: string): Promise<IOption[]> => {
      const option = await fetchOption({
        callerSource,
        searchValue,
        accountTypeId
      });
      return option;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountTypeId]
  );

  return <AssociatedEntity {...props} fetchOptions={handleFetchOption} />;
};

AssociatedAccount.defaultProps = {
  accountTypeId: ''
};

export default AssociatedAccount;
