import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { trackError } from 'common/utils/experience/utils/track-error';

export const getFilteredOptions = (options: IOption[], searchText: string): IOption[] => {
  try {
    const filteredOptions: IOption[] = [];
    const validSearchText = searchText?.toLowerCase();

    options.forEach((group) => {
      if (group?.label?.toLowerCase()?.includes(validSearchText)) {
        filteredOptions?.push(group);
      } else if (group?.subOptions?.length) {
        const tempGroup = { ...group };
        const filteredSubOptions: IOption[] = [];
        tempGroup?.subOptions?.forEach((opt) => {
          if (opt?.label?.toLowerCase()?.includes(validSearchText)) {
            filteredSubOptions?.push(opt);
          }
        });
        if (filteredSubOptions?.length) {
          tempGroup.subOptions = filteredSubOptions;
          filteredOptions?.push(tempGroup);
        }
      }
    });
    return filteredOptions;
  } catch (err) {
    trackError(err);
    return options;
  }
};
