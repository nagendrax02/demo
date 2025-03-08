import { lazy, useEffect } from 'react';
import { fetchOptions } from './utils';
import { ISelectedLeadFilterOption } from './accountLeadFilter.types';
import styles from '../filters.module.css';
import useActivityHistoryStore from 'apps/activity-history/activity-history.store';
import { IActivityHistoryStore } from 'apps/activity-history/types';
import useEntityStore from 'apps/entity-details/entitydetail.store';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const AccountLeadFilter = (): JSX.Element => {
  const { accountLeadSelectedOption, setAccountLeadSelectedOption } =
    useActivityHistoryStore<IActivityHistoryStore>();

  const { coreData, setCoreData } = useEntityStore();
  const { setAugmentedAHDetails }: IActivityHistoryStore = useActivityHistoryStore();

  const handleCoreData = (value: string): void => {
    const data = { ...coreData };
    data.entityIds.lead = value;
    setCoreData(data);
  };

  useEffect(() => {
    if (accountLeadSelectedOption?.length) {
      handleCoreData(accountLeadSelectedOption[0]?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelection = (options: ISelectedLeadFilterOption[]): void => {
    if (!options?.length) {
      setAugmentedAHDetails([]);
      setAccountLeadSelectedOption([]);
      return;
    } else if (options?.[0]?.value !== accountLeadSelectedOption?.[0]?.value) {
      setAccountLeadSelectedOption(options);
      handleCoreData(options[0]?.value || '');
    }
  };

  return (
    <div className={styles.account_lead_filter}>
      <Dropdown
        fetchOptions={fetchOptions}
        setSelectedValues={handleSelection}
        showCheckIcon
        placeHolderText="Search to select a Lead"
        selectedValues={accountLeadSelectedOption}
      />
    </div>
  );
};

export default AccountLeadFilter;
