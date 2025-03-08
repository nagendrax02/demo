import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IDropdownGroupOption,
  IDropdownOption,
  IOptions
} from 'common/utils/entity-data-manager/entity-data-manager.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import productDataManager from 'common/utils/entity-data-manager/product';
import { CallerSource } from 'common/utils/rest-client';
import { IBulkUpdateField } from '../bulk-update.types';
import { FIELD_SEPARATOR } from 'common/constants';
import { BULK_UPDATE_HELPER } from '../constant';
import { getSelectedFieldValue } from '../bulk-update.store';

const getAugmentedOptions = (options: IOptions): IOption[] => {
  const augmentedOptions: IOption[] = [];
  options?.map((option: IDropdownOption | IDropdownGroupOption) => {
    if ('options' in option) {
      augmentedOptions.push({
        label: option?.label,
        value: option?.label,
        subOptions: option?.options
      });
    } else if (option?.value) {
      augmentedOptions.push({
        label: option?.label,
        value: option?.value,
        text: option?.text
      });
    }
  });
  return augmentedOptions;
};

export const getProductOption = async (searchText: string): Promise<IOption[]> => {
  try {
    const options = await productDataManager?.getDropdownOptions({
      body: {
        searchText
      },
      callerSource: CallerSource?.SmartViews
    });
    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

export const getDropdownValue = (options: IOption[], separator = ';'): string => {
  return options?.map((option) => option?.value)?.join(separator);
};

export const getDropdownOption = async (
  field: IBulkUpdateField,
  searchText: string
): Promise<IBulkUpdateField[]> => {
  const { initGridConfig } = getSelectedFieldValue();
  const value = (field?.schemaName as string)?.split(FIELD_SEPARATOR);
  const schemaName = value?.[0];
  const customObjectSchemaName = value?.[1] || '';
  const isTimeZone = field?.schemaName === 'TimeZone';
  const options = await BULK_UPDATE_HELPER[initGridConfig.entityType]?.dropdownOptionGet({
    schemaName,
    customObjectSchemaName,
    searchText,
    code: initGridConfig?.eventCode
  });

  if (isTimeZone) {
    return options?.map((item) => {
      return {
        value: item?.value as string,
        label: item?.text as string,
        text: item?.label as string
      };
    }) as unknown as IBulkUpdateField[];
  }
  return getAugmentedOptions(options) as IBulkUpdateField[];
};
