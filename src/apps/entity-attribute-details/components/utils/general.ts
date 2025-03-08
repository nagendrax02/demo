import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IAugmentedAttributeFields,
  IAugmentedAttributes
} from 'apps/entity-details/types/entity-data.types';
import { getAugmentedValue } from './augment';
import { DataType } from 'common/types/entity/lead';

const cleanName = (text: string): string => {
  return text?.replace(/<\/?[^>]+(>|$)/g, '').replace('*', '');
};

const filterAttributesFn = (field: IAugmentedAttributeFields): boolean => {
  if (field?.value) {
    return true;
  }
  if (field?.dataType === DataType.File) {
    return true;
  }
  return false;
};

const getFilteredAttributes = (
  augmentedAttributes: IAugmentedAttributes[]
): IAugmentedAttributes[] => {
  if (!augmentedAttributes) {
    return [];
  }
  try {
    return augmentedAttributes?.map((item) => {
      const fields = item?.fields?.length ? item?.fields?.filter(filterAttributesFn) : [];
      return {
        ...item,
        fields: fields.map((cfsItem) => {
          return {
            ...cfsItem,
            cfsFields: cfsItem?.cfsFields?.length
              ? cfsItem?.cfsFields?.filter(filterAttributesFn)
              : []
          };
        })
      };
    });
  } catch (error) {
    trackError(error);
    return augmentedAttributes;
  }
};

const matchFields = (
  fields: IAugmentedAttributeFields[],
  searchKeyword: string
): { fields: IAugmentedAttributeFields[]; matchedCount: number } => {
  if (!fields?.length) {
    return { fields: [], matchedCount: 0 };
  }
  try {
    let count = 0;
    const augmentedFields = fields?.map((field) => {
      const augmentedValue = getAugmentedValue(field?.dataType, field?.value);
      if (
        field?.name?.toLowerCase()?.includes(searchKeyword) ||
        field?.value?.toLowerCase()?.includes(searchKeyword) ||
        augmentedValue?.toLowerCase()?.includes(searchKeyword)
      ) {
        if (field?.dataType !== DataType.CustomObject) {
          count += 1;
        }
        return {
          ...field,
          isMatched: true
        };
      }
      return { ...field, isMatched: false };
    });
    return { fields: augmentedFields, matchedCount: count };
  } catch (error) {
    trackError(error);
    return { fields: fields, matchedCount: 0 };
  }
};

const highlightFields = (
  augmentedAttributes: IAugmentedAttributes[],
  searchKeyword: string
): { attributes: IAugmentedAttributes[]; matchedCount: number } => {
  const cleanSearchKeyword = searchKeyword?.trim()?.toLowerCase();

  if (!augmentedAttributes) {
    return { attributes: [], matchedCount: 0 };
  }

  if (!cleanSearchKeyword) {
    return { attributes: augmentedAttributes, matchedCount: 0 };
  }

  if (cleanSearchKeyword?.length < 2) {
    return { attributes: augmentedAttributes, matchedCount: 0 };
  }

  try {
    let matchedCount = 0;
    const attributes = augmentedAttributes.map((item) => {
      const matchedFields = matchFields(item?.fields || [], cleanSearchKeyword);
      matchedCount += matchedFields?.matchedCount;
      const fields = matchedFields?.fields?.map((cfsItems) => {
        if (cfsItems?.cfsFields?.length) {
          const matchedCFSFields = matchFields(cfsItems?.cfsFields || [], cleanSearchKeyword);
          matchedCount += matchedCFSFields?.matchedCount;
          return {
            ...cfsItems,
            cfsFields: matchedCFSFields?.fields
          };
        }
        return cfsItems;
      });
      return { ...item, fields: fields };
    });

    return { attributes, matchedCount };
  } catch (error) {
    trackError(error);
    return { attributes: augmentedAttributes, matchedCount: 0 };
  }
};

export { cleanName, getFilteredAttributes, highlightFields };
