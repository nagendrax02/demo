import { INavigationItem } from '../../app-header.types';
import { findNavItemById } from '../../utils/nav-item-utils';

export const isChildNavItemSelected = (
  selectedModuleItemId: string,
  data?: INavigationItem[] | null
): boolean => {
  if (data) return !!findNavItemById(selectedModuleItemId, data);
  return false;
};
