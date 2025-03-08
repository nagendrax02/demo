import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IDisplayConfig } from 'common/component-lib/associated-entity-dropdown/associated-entity/associated-entity.types';
import AssociatedEntityLabel from './AssociatedEntityLabel';

// TODO: SW-5568 Remove V1 fetchAugmentedOptions function after all the pages are migrated to V2
export const fetchV2AugmentedOptions = async ({
  options,
  displayConfig,
  valueKey,
  showSelectedValueAsText
}: {
  options: IOption[];
  displayConfig: IDisplayConfig;
  valueKey: string;
  showSelectedValueAsText?: boolean;
}): Promise<IOption[]> => {
  const labelKey = displayConfig?.titleKeys?.[0];
  const updatedOptions: IOption[] = options?.map((option) => {
    return {
      ...option,
      label: showSelectedValueAsText ? (option[labelKey] as string) : '',
      value: option?.[valueKey] as string,
      customComponent: (
        <AssociatedEntityLabel
          config={option}
          titleKeys={displayConfig?.titleKeys}
          body={displayConfig?.body}
          fallbackTitleKeys={displayConfig?.fallbackTitleKeys || []}
        />
      )
    };
  });

  return updatedOptions;
};
