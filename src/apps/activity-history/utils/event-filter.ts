import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IActivityCategoryMetadata } from '../types/category-metadata.types';
import { fetchCategoryMetadata } from './activity-category-metadata';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { EntityType } from 'common/types';
import { SELECT_ALL } from '../constants';

export interface IEventFilters {
  EventType: number;
  EventCodes: string[];
}

const processFilteredItems = (
  filteredItems: IActivityCategoryMetadata[],
  eventFilters: IEventFilters[]
): void => {
  filteredItems.forEach((filteredItem) => {
    const existingEvent = eventFilters.find((r) => r.EventType === filteredItem.EventType);

    if (existingEvent) {
      existingEvent.EventCodes.push(filteredItem.Value);
    } else {
      eventFilters.push({
        EventType: filteredItem.EventType,
        EventCodes: [filteredItem.Value]
      });
    }
  });
};

const getEventFilter = async (
  selectedTypeFilter: IOption[],
  type?: EntityType,
  eventCode?: string
): Promise<IEventFilters[]> => {
  if (selectedTypeFilter.length === 0) {
    return [
      {
        EventType: -9999,
        EventCodes: []
      }
    ];
  }

  const categoryMetadata = await fetchCategoryMetadata(type, eventCode);
  const categoryMetadataHashMap = createHashMapFromArray(categoryMetadata, 'Value');

  const filterEventBySelectedEvent: IActivityCategoryMetadata[] = [];
  const eventFilters: IEventFilters[] = [];

  selectedTypeFilter.forEach((filter) => {
    const matchedCategoryMetadata = categoryMetadataHashMap[filter?.value];
    if (matchedCategoryMetadata) {
      filterEventBySelectedEvent.push(matchedCategoryMetadata);
    }
  });

  processFilteredItems(filterEventBySelectedEvent, eventFilters);

  return eventFilters;
};

const getActivityEventCodes = (selectedTypeFilter: IOption[]): string[] => {
  if (!selectedTypeFilter?.length) {
    return ['-9999'];
  }
  return selectedTypeFilter?.map((item) => item.value)?.filter((val) => val !== SELECT_ALL);
};

export { getEventFilter, getActivityEventCodes };
