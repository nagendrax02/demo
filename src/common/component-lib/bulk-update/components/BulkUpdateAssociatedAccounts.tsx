import { useState } from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import {
  IAssociatedAccountOption,
  AssociatedAccount
} from 'common/component-lib/associated-entity-dropdown';
import { CallerSource } from 'common/utils/rest-client';
import { InputId } from '../bulk-update.types';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import { ASSOCIATE_ACCOUNT_DISPLAY_CONFIG } from '../constant';
import {
  isMiP,
  openEntityDetailsPagesInPlatform,
  openEntityDetailsPagesInStandalone
} from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';

const BulkUpdateAssociatedAccounts = (): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<IAssociatedAccountOption[]>();
  const setUpdateTo = useBulkUpdate((state) => state.setUpdateTo);
  const error = useBulkUpdate((state) => state.error);

  const handleOptionSelection = (data: IAssociatedAccountOption[]): void => {
    setSelectedOption(data);
    const optionSelected = data?.[0];
    setUpdateTo({
      value: optionSelected?.value,
      accountId: optionSelected?.AccountId,
      accountTypeId: optionSelected?.AccountTypeId
    });
  };

  const handleAccountInNewTab = (data?: IAssociatedAccountOption): void => {
    if (!data?.AccountId || !data?.AccountTypeName) return;
    if (!isMiP()) {
      openEntityDetailsPagesInStandalone({
        entity: EntityType.Account,
        accountTypeId: data?.AccountTypeId,
        id: data?.AccountId,
        openInNewTab: true
      });
    } else {
      openEntityDetailsPagesInPlatform({
        entity: EntityType.Account,
        accountType: data?.AccountTypeName,
        id: data?.AccountId
      });
    }
  };
  return (
    <AssociatedAccount
      setSelectedValues={handleOptionSelection}
      selectedValues={selectedOption}
      callerSource={CallerSource?.BulkUpdate}
      inputId={InputId.UpdateTo}
      error={error === InputId.UpdateTo}
      displayConfig={ASSOCIATE_ACCOUNT_DISPLAY_CONFIG}
      openInNewTabHandler={handleAccountInNewTab}
      valueKey="AccountId"
      placeHolderText="Select"
      suspenseFallback={<Shimmer height="32px" width="100%" />}
      adjustHeight
    />
  );
};

export default BulkUpdateAssociatedAccounts;
