import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import AssociatedEntityLabel from './associated-entity-label/AssociatedEntityLabel';
import SelectedOption from './associated-entity-label/SelectedOption';
import { IDisplayConfig } from './associated-entity.types';

export const fetchAugmentedOptions = async ({
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
          showSelectedValueAsText={showSelectedValueAsText}
        />
      )
    };
  });

  return updatedOptions;
};

export const getSelectedValue = (
  titleKeys: string[],
  selectedValue?: IOption[],
  openInNewTabHandler?: () => void
): IOption[] | undefined => {
  const value = selectedValue?.[0];

  if (!value) return undefined;
  return [
    {
      ...value,
      customComponent: (
        <SelectedOption
          titleKeys={titleKeys}
          selectedOption={value}
          openInNewTabHandler={openInNewTabHandler}
        />
      )
    }
  ];
};
