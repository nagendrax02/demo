import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDateOption } from 'common/component-lib/date-filter';
import { TabType } from 'apps/smart-views/constants/constants';
import { IFilter, IFilterConfig } from '../../smartview-tab.types';

export interface ICommonFilterProps {
  defaultValues: IDateOption | IOption[];
  fetchOptions: (searchText?: string | undefined) => IOption[] | Promise<IOption[]>;
  onChange: (option: IOption[] | IDateOption) => void;
  filterLabel: string;
  isDisabled?: boolean;
  enableDateTimePicker?: boolean;
  includeSecondsForEndDate?: boolean;
  bySchemaName: IFilterConfig;
  schemaName: string;
  avoidUTCFormatting?: boolean;
  filters: IFilter;
  onOpenChange: (isOpen: boolean) => void;
}

export interface IGetFilterValue {
  selectedOption: IOption[] | IDateOption;
  schemaName: string;
  tabType: TabType;
  entityCode?: string;
  utcDateFormatEnabled?: boolean;
}

export interface IHandleDateFilter {
  selectedOption: IDateOption;
  replacedSchema: string;
  tabType: TabType;
  utcDateFormatEnabled?: boolean;
}

export type IUserFilterOption = IOption<{ text?: string }>;

export type ITaskTypeFilterOption = IOption<{ text?: string }>;
