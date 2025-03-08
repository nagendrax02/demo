import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';

export const getAugmentedOptions = async (
  options: IOption[],
  fetchOptions: (searchText?: string | undefined) => IOption[] | Promise<IOption[]>
): Promise<IOption[]> => {
  try {
    const optionsWithLabel: IOption[] = [];
    const optionsWithoutLabel: string[] = [];
    const augmentedOptions: IOption[] = [];

    options?.forEach((option) => {
      if (option?.label) {
        optionsWithLabel.push(option);
      } else if (option?.value) {
        optionsWithoutLabel.push(option.value);
      }
    });

    await Promise.all(
      optionsWithoutLabel?.map(async (value) => {
        const fetchedOptions = await fetchOptions();
        const finalOption = fetchedOptions?.filter((item) => item.value === value)?.[0];
        if (finalOption) augmentedOptions.push(finalOption);
      })
    );

    return [...augmentedOptions, ...optionsWithLabel];
  } catch (error) {
    trackError(error);
    return options;
  }
};
