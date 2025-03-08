import { trackError } from 'common/utils/experience/utils/track-error';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { createStoredPromise, getStoredPromise } from './promise-helpers';

const fetchProductNameFromIds = async (
  productIds: string[],
  callerSource: CallerSource
): Promise<Record<string, string>> => {
  return httpPost({
    path: API_ROUTES.getProductNames,
    module: Module.Marvin,
    callerSource,
    body: productIds
  });
};

export const getProductNames = async (
  productIds: string[],
  callerSource: CallerSource
): Promise<Record<string, string>> => {
  const cachedNames: Record<string, string> = getItem(StorageKey.ProductNames) || {};
  const uniqueIds = new Set(productIds);
  const namesMap: Record<string, string> = {};
  const remainingIds: string[] = [];
  uniqueIds.forEach((id) => {
    if (cachedNames[id]) {
      namesMap[id] = cachedNames[id];
    } else {
      remainingIds.push(id);
    }
  });
  if (!remainingIds.length) {
    return namesMap;
  } else {
    try {
      const response = await fetchProductNameFromIds(remainingIds, callerSource);
      setItem(StorageKey.ProductNames, { ...cachedNames, ...response });
      return { ...response, ...namesMap };
    } catch (err) {
      trackError(err);
    }
    return namesMap;
  }
};

export const productValueHandler = (): {
  addProductIds: (value: string) => void;
  startApi: (callerSource: CallerSource) => Promise<void>;
  getApiPromise: () => Promise<void>;
} => {
  const KEY = 'PRODUCT_FIELDS';
  let productIds: string[] = [];
  const cachedProducts: Record<string, string> = getItem(StorageKey.ProductNames) ?? {};

  return {
    addProductIds: (value: string): void => {
      if (!value || typeof value !== 'string') return;

      const toBeCalledIds = value.split(',').filter((id) => !cachedProducts[id]);
      productIds.push(...toBeCalledIds);
    },
    startApi: async (callerSource: CallerSource): Promise<void> => {
      try {
        const productSet = new Set(productIds);
        // awaiting to handle if there are any /Product/GetName api calls going
        await getStoredPromise(KEY);

        if (productSet.size) {
          createStoredPromise(KEY, getProductNames(Array.from(productSet), callerSource));
          productIds = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    getApiPromise: async (): Promise<void> => {
      return getStoredPromise(KEY);
    }
  };
};
