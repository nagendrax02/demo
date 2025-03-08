import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { SORT_FILTER_OPTION } from './constants';

export const DEFAULT_SORT_OPTION: IOption = {
  label: SORT_FILTER_OPTION[0].label,
  value: SORT_FILTER_OPTION[0].value,
  customComponent: SORT_FILTER_OPTION[0].label
};
