import { trackError } from 'common/utils/experience/utils/track-error';
import { EntityType } from 'common/types';
import { IActivityCategoryMetadata } from '../../types';
import { StorageKey, setItem, getItem } from 'common/utils/storage-manager';
import { getTabDetailId } from 'common/utils/helpers/helpers';

const setCategoryMetadataCache = (
  metadata: IActivityCategoryMetadata[],
  type?: EntityType
): void => {
  try {
    const getTabId = getTabDetailId();

    const categoryMetaDataItem =
      (getItem(StorageKey.ActivityCategoryMetadata) as Record<
        string,
        IActivityCategoryMetadata[]
      >) || {};
    const storeKey = `${type ? type : ''}-${getTabId}`;
    categoryMetaDataItem[storeKey] = metadata;
    setItem(StorageKey.ActivityCategoryMetadata, categoryMetaDataItem);
  } catch (error) {
    trackError(error);
  }
};

const getCategoryMetadataCache = (type?: EntityType): IActivityCategoryMetadata[] | undefined => {
  try {
    const categoryMetaDataItem =
      (getItem(StorageKey.ActivityCategoryMetadata) as Record<
        string,
        IActivityCategoryMetadata[]
      >) || {};
    const getTabId = getTabDetailId();
    const storeKey = `${type ? type : ''}-${getTabId}`;
    return categoryMetaDataItem?.[storeKey];
  } catch (error) {
    trackError(error);
  }
};

export { setCategoryMetadataCache, getCategoryMetadataCache };
