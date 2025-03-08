import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

export const getTitle = ({
  config,
  titleKeys,
  fallbackTitleKeys
}: {
  titleKeys: string[];
  config: IOption;
  fallbackTitleKeys?: string[];
}): string => {
  const titleValue = titleKeys
    ?.map((titleKey) => config?.[titleKey] as string)
    ?.join(' ')
    ?.trim();

  if (titleValue) {
    return titleValue;
  }

  const fallbackValue = fallbackTitleKeys?.find((key) => config[key] as string);
  return fallbackValue ? (config?.[fallbackValue] as string) : 'No Name';
};
