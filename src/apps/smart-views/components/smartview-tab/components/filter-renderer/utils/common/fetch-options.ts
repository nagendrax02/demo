import { trackError } from 'common/utils/experience/utils/track-error';
import { EntityType, IAuthenticationConfig, IUserOption, IUserOptionGroup } from 'common/types';
import getEntityDataManager, { userDataManager } from 'common/utils/entity-data-manager';
import productDataManager from 'common/utils/entity-data-manager/product';
import { CallerSource } from 'common/utils/rest-client';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import {
  IDropdownGroupOption,
  IDropdownOption,
  IFetchDropdownPayload,
  IOptions
} from 'common/utils/entity-data-manager/entity-data-manager.types';
import { IUser } from 'common/types/authentication.types';
import { SCHEMA_NAMES } from 'apps/smart-views/constants/constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IUserFilterOption } from '../../filter-renderer.types';

const isMailingPreferenceSearchIncluded = (
  payload: IFetchDropdownPayload,
  option: IDropdownOption
): boolean => {
  return (
    payload?.schemaName === SCHEMA_NAMES.MAILING_PREFERENCES &&
    !!payload?.searchText &&
    !option?.label?.toLowerCase()?.includes(payload?.searchText?.toLowerCase())
  );
};

const getAugmentedOptions = (options: IOptions, payload?: IFetchDropdownPayload): IOption[] => {
  const augmentedOptions: IOption[] = [];
  options?.map((option: IDropdownOption | IDropdownGroupOption) => {
    if ('options' in option) {
      augmentedOptions.push({
        label: option?.label,
        value: option?.label,
        subOptions: option?.options ? getAugmentedOptions(option?.options) : undefined
      });
    } else if (option?.value) {
      // handling mailing preferances search currently here, but needs to be fixed on backend
      if (payload && isMailingPreferenceSearchIncluded(payload, option)) {
        return;
      }
      augmentedOptions.push({
        label: option?.label,
        value: option?.value
      });
    }
  });
  return augmentedOptions;
};

const addCurrentUser = async (
  options: IUserOption[],
  currentUser: IUser
): Promise<IUserOption[]> => {
  const findIndexAndUpdate = (userOptions: IUserOption[]): number => {
    const index = userOptions?.findIndex((user) => user?.text === currentUser?.EmailAddress);
    if (index !== -1 && userOptions?.length) {
      const currentUserOption = userOptions[index];
      options?.splice(index, 1);
      options?.unshift(currentUserOption);
    }
    return index;
  };

  try {
    let index = findIndexAndUpdate(options);
    if (index === -1 && currentUser?.FullName) {
      const user = (await userDataManager.getDropdownOptions({
        searchText: currentUser?.FullName,
        callerSource: CallerSource.SmartViews
      })) as IUserOption[];
      index = findIndexAndUpdate(user);
    }
  } catch (error) {
    trackError(error);
  }
  return options;
};

const getUserDropdownOptions = async (searchText: string): Promise<IUserFilterOption[]> => {
  const { User: currentUser } = (getItem(StorageKey.Auth) || {}) as IAuthenticationConfig;

  const userOptions = await userDataManager.getDropdownOptions({
    searchText,
    callerSource: CallerSource.SmartViews
  });
  const updatedUserOptions = !searchText
    ? await addCurrentUser(userOptions as IUserOption[], currentUser)
    : userOptions;
  const finalOptions: IUserFilterOption[] = [];

  updatedUserOptions?.map((option: IUserOption | IUserOptionGroup) => {
    if ('value' in option) {
      let label = option?.label || '';
      if (option?.text === currentUser?.EmailAddress) {
        label = `Me (${label})`;
      }
      const value = option?.value || '';
      const text = option?.text || '';
      finalOptions.push({
        label: label,
        value: value,
        text: text
      });
    }
  });

  return finalOptions;
};

const getSalesGroupOptions = async (
  payload: IFetchDropdownPayload,
  entityType: EntityType
): Promise<IOption[]> => {
  try {
    const options =
      (await (
        await getEntityDataManager(entityType)
      )?.getSalesGroupOptions?.({
        body: payload,
        callerSource: CallerSource.SmartViews
      })) || [];

    const augmentedOptions = getAugmentedOptions(options);
    return augmentedOptions;
  } catch (error) {
    trackError(error);
  }
  return [];
};

const getProductOption = async (searchText: string): Promise<IOption[]> => {
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

export { getUserDropdownOptions, getAugmentedOptions, getSalesGroupOptions, getProductOption };
