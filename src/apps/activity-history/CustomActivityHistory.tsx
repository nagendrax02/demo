import { useEffect, useState } from 'react';
import { ITabsConfig } from '../entity-details/types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { fetchCategoryMetadata } from './utils';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { IActivityCategoryMetadata } from './types';
import { MULTI_SELECT_ALL, SELECT_ALL } from './constants';
import ActivityHistoryRoot from '.';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

interface ICustomActivityHistory {
  tab: ITabsConfig;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const CustomActivityHistory = (props: ICustomActivityHistory): JSX.Element => {
  const { tab, entityDetailsCoreData } = props;
  const [typeFilterOptions, setTypeFilterOptions] = useState<IOption[]>();

  const { entityDetailsType, eventCode } = entityDetailsCoreData;

  const getTypeFilterFromActivities = (
    eventCodes: string[],
    categoryMetadata: IActivityCategoryMetadata[]
  ): IOption[] => {
    let allSelected = false;
    const categoryMetadataHashMap = createHashMapFromArray(categoryMetadata, 'Value');
    const options = eventCodes?.map((code) => {
      const eventData = categoryMetadataHashMap[code];
      if (code === SELECT_ALL || code === MULTI_SELECT_ALL) {
        allSelected = true;
      }
      return {
        category: eventData?.Category,
        label: eventData?.Text,
        value: eventData?.Value
      };
    });
    if (allSelected) {
      return [];
    } else {
      return options;
    }
  };

  useEffect(() => {
    const getTypeFilters = async (): Promise<void> => {
      const categoryMetadata = await fetchCategoryMetadata(
        entityDetailsType,
        eventCode ? `${eventCode}` : undefined
      );
      const eventCodes = (tab?.activities || '').split(',');
      const typeFilter = getTypeFilterFromActivities(eventCodes, categoryMetadata);
      setTypeFilterOptions(typeFilter);
    };

    getTypeFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab?.activities]);

  return (
    <ActivityHistoryRoot
      type={entityDetailsType}
      customTypeFilter={typeFilterOptions}
      tabType={tab?.type}
      entityDetailsCoreData={entityDetailsCoreData}
    />
  );
};

export default CustomActivityHistory;
