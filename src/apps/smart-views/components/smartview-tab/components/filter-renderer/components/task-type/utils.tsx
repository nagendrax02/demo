import CustomOption from './CustomOption';
import { ITaskTypeFilterOption } from '../../filter-renderer.types';

export const getAugmentedOptions = async (
  options: ITaskTypeFilterOption[],
  fetchOptions: (
    searchText?: string | undefined
  ) => ITaskTypeFilterOption[] | Promise<ITaskTypeFilterOption[]>
): Promise<ITaskTypeFilterOption[]> => {
  const optionsWithLabel: ITaskTypeFilterOption[] = [];
  const optionsWithoutLabel: string[] = [];
  let augmentedOptions: ITaskTypeFilterOption[] = [];

  options?.forEach((option) => {
    if (option?.label) {
      optionsWithLabel.push(option);
    } else if (option?.value) {
      optionsWithoutLabel.push(option.value);
    }
  });

  if (optionsWithoutLabel?.length) {
    const allOptions = await fetchOptions();
    optionsWithoutLabel?.forEach((value) => {
      // filter from parent options
      let filteredOption = allOptions?.filter((option) => option.value === value)?.[0];

      // filter from subOptions
      if (!filteredOption) {
        const allSubOptions = allOptions?.reduce((subOptions: ITaskTypeFilterOption[], curr) => {
          subOptions = [...subOptions, ...(curr.subOptions || [])];
          return subOptions;
        }, []);
        filteredOption = allSubOptions?.filter((option) => option.value === value)?.[0];
      }

      // combine options filtered
      if (filteredOption) {
        augmentedOptions = [
          ...augmentedOptions,
          ...(filteredOption?.subOptions || [filteredOption])
        ];
      }
    });
  }

  return [...augmentedOptions, ...optionsWithLabel];
};

export const getAugmentedFetchOptions = (
  options: ITaskTypeFilterOption[]
): ITaskTypeFilterOption[] => {
  return options?.map((option) => {
    if (option?.subOptions?.length) {
      return {
        ...option,
        subOptions: getAugmentedFetchOptions(option?.subOptions)
      };
    } else {
      return {
        ...option,
        customComponent: <CustomOption option={option} />
      };
    }
  });
};
