import { trackError } from 'common/utils/experience/utils/track-error';
import { getUserNames } from 'common/component-lib/user-name';
import { CallerSource } from 'common/utils/rest-client';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { TriggerState } from '../components/trigger/Trigger';

export const getAugmentedUserOptions = async (options: IOption[]): Promise<IOption[]> => {
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

    const userLablesMap = await getUserNames(optionsWithoutLabel, CallerSource.SmartViews);
    const currentUser = getPersistedAuthConfig()?.User;
    optionsWithoutLabel.forEach((currentValue) => {
      let label = userLablesMap?.[currentValue];
      if (currentValue === currentUser?.Id) {
        label = label = `Me (${label})`;
      }
      if (label) augmentedOptions.push({ label, value: currentValue });
    });

    return [...augmentedOptions, ...optionsWithLabel];
  } catch (error) {
    trackError(error);
    return options;
  }
};

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
        const fetchedOptions = await fetchOptions(value);
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

export const getAugmentedGroupedOptions = async (
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
        const fetchedOptions = await fetchOptions(value);
        fetchedOptions?.forEach((fetchedOption) => {
          const finalOption = fetchedOption?.subOptions?.filter(
            (item) => item.value === value
          )?.[0];
          if (finalOption) augmentedOptions.push(finalOption);
          return;
        });
      })
    );

    return [...augmentedOptions, ...optionsWithLabel];
  } catch (error) {
    trackError(error);
    return options;
  }
};

export const getTriggerState = (open: boolean, isDisabled?: boolean): TriggerState => {
  if (isDisabled) {
    return TriggerState.Disabled;
  }
  return open ? TriggerState.Active : TriggerState.Inactive;
};

export const removeCustomComponent = (options: IOption[]): IOption[] => {
  const updatedOptions = options.map((option) => {
    const { customComponent, ...rest } = option;
    return rest;
  });

  return updatedOptions;
};
