import { IFilterConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

const isIncludedInSearch = (label: string, search: string): boolean => {
  return label?.toLowerCase().includes(search.toLowerCase());
};

export const segregateFilters = (
  selectedFilters: string[],
  bySchemaName: IFilterConfig,
  search: string
): { pinnedFilters: string[]; otherFilters: string[] } => {
  return selectedFilters.reduce(
    (acc: { pinnedFilters: string[]; otherFilters: string[] }, filterSchema) => {
      if (!isIncludedInSearch(bySchemaName[filterSchema].label, search)) {
        return acc;
      }
      if (bySchemaName[filterSchema]?.isPinned) {
        acc.pinnedFilters.push(filterSchema);
      } else {
        acc.otherFilters.push(filterSchema);
      }
      return acc;
    },
    {
      pinnedFilters: [],
      otherFilters: []
    }
  );
};
