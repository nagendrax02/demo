import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

export interface IDateOption {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

export interface IDate {
  startDate: Date;
  endDate: Date;
}

export interface IDateFilter {
  selectedOption: IDateOption | undefined;
  setSelectedOption: (option: IDateOption) => void;
  onCustomOptionSelection?: () => void;
  customStyleClass?: string;
  showDateTimePickerForCustom?: boolean;
  includeSecondsForEndDate?: boolean;
  avoidUTCFormatting?: boolean;
  getTrigger?: (
    open: boolean,
    setSelectedValues: (selectedValues: IOption[]) => void
  ) => JSX.Element;
  openOnRender: boolean;
  onOpenChange?: (open: boolean) => void;
}
