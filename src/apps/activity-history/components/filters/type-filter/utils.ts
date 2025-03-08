import { trackError } from 'common/utils/experience/utils/track-error';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { getOpportunityRepresentationName } from 'common/utils/helpers';
import { IActivityCategoryMetadata } from '../../../types';
import { fetchCategoryMetadata } from '../../../utils';
import {
  TabType,
  IEntityRepresentationName,
  IOppRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType } from 'common/types';

interface IFetchOptionsParams {
  searchText?: string;
  customTypeFilter?: IOption[];
  tabType?: TabType;
  leadRepName?: IEntityRepresentationName;
  type?: EntityType;
  eventCode?: string;
}

const VALUES = {
  LEAD: 'Lead',
  OPPORTUNITY: 'opportunity',
  OPPORTUNITIES: 'opportunities',
  OTHER_ACTIVITIES: 'other activities'
};

const isTextReplaceable = (text: string, searchText: string): boolean => {
  const regex = new RegExp(`\\b${searchText}\\b`, 'i');
  return regex.test(text);
};

const getAugmentedOptionWithLeadRepName = (
  response: IActivityCategoryMetadata[],
  leadRepName?: IEntityRepresentationName
): IActivityCategoryMetadata[] => {
  return response.map((item) => {
    let data = item;
    if (isTextReplaceable(item?.Text, VALUES.LEAD)) {
      data = {
        ...data,
        Text: item?.Text?.replace(VALUES.LEAD, `${leadRepName?.SingularName || VALUES.LEAD}`)
      };
    }
    if (isTextReplaceable(item?.Text, VALUES.LEAD)) {
      data = {
        ...data,
        Category: item?.Category?.replace(
          VALUES.LEAD,
          `${leadRepName?.SingularName || VALUES.LEAD}`
        )
      };
    }
    return { ...data };
  });
};

const replaceOpportunityText = (text: string, oppRepName?: IOppRepresentationName): string => {
  if (!text) {
    return '';
  }
  return text
    .replace(VALUES.OPPORTUNITY, oppRepName?.OpportunityRepresentationSingularName || '')
    .replace(VALUES.OPPORTUNITIES, oppRepName?.OpportunityRepresentationPluralName || '');
};

export const getAugmentedOptionWithOppRepName = (
  response: IActivityCategoryMetadata[],
  oppRepName?: IOppRepresentationName
): IActivityCategoryMetadata[] => {
  return response.map((item) => {
    const { Text, Category } = item;
    const lowerCaseText = Text?.toLocaleLowerCase();
    const lowerCategoryText = Category?.toLocaleLowerCase();
    const data: IActivityCategoryMetadata = { ...item };

    if (
      lowerCategoryText !== VALUES.OPPORTUNITIES &&
      lowerCategoryText !== VALUES.OTHER_ACTIVITIES &&
      (isTextReplaceable(lowerCaseText, VALUES.OPPORTUNITY) ||
        isTextReplaceable(lowerCaseText, VALUES.OPPORTUNITIES))
    ) {
      data.Text = replaceOpportunityText(lowerCaseText, oppRepName);
    }

    if (
      isTextReplaceable(lowerCategoryText, VALUES.OPPORTUNITY) ||
      isTextReplaceable(lowerCategoryText, VALUES.OPPORTUNITIES)
    ) {
      data.Category = replaceOpportunityText(lowerCategoryText, oppRepName);
    }

    return data;
  });
};

const groupDataByCategory = (options: IActivityCategoryMetadata[]): IOption[] => {
  const groupedOptions: Record<string, IOption> = options.reduce((accumulator, current) => {
    const { Category, Value, Text } = current;

    if (!accumulator[Category]) {
      accumulator[Category] = {
        label: Category,
        value: Category,
        subOptions: [{ value: Value, label: Text, category: Category }]
      };
    } else {
      accumulator[Category].subOptions.push({ value: Value, label: Text, category: Category });
    }

    return accumulator;
  }, {});

  return Object.values(groupedOptions);
};

const filterSubOptions = (subOptions: IOption[] | undefined, searchedText: string): IOption[] => {
  if (!subOptions) {
    return [];
  }

  return subOptions.filter((option) =>
    option.label.toLowerCase().includes(searchedText.toLowerCase())
  );
};

const filterOptions = (data: IOption[], searchedText?: string): IOption[] => {
  if (!searchedText) {
    return data;
  }

  return data
    .map((item) => {
      const filterByGroupLabel = item?.label.toLowerCase().includes(searchedText.toLowerCase());
      if (filterByGroupLabel) {
        return item;
      }

      const filteredItem = filterSubOptions(item?.subOptions, searchedText);
      if (filteredItem?.length) {
        return { ...item, subOptions: filteredItem };
      }

      return null;
    })
    .filter((item) => item) as IOption[];
};

const filterBasedOnTabType = ({
  tabType,
  customTypeFilter,
  allOptions,
  entityType
}: {
  tabType: TabType | undefined;
  customTypeFilter: IOption[] | undefined;
  allOptions: IActivityCategoryMetadata[];
  entityType?: EntityType;
}): IActivityCategoryMetadata[] => {
  if (
    entityType !== EntityType.Opportunity &&
    tabType === TabType.CustomTab &&
    customTypeFilter?.length
  ) {
    return allOptions?.filter(
      (option) => customTypeFilter?.find((type) => type.value === option.Value)
    );
  }
  return allOptions;
};

export const fetchOptions = async ({
  searchText,
  customTypeFilter,
  tabType,
  leadRepName,
  type,
  eventCode
}: IFetchOptionsParams): Promise<IOption[]> => {
  try {
    let response = (await fetchCategoryMetadata(type, eventCode)) || [];
    const oppRepName = await getOpportunityRepresentationName(
      CallerSource.ActivityHistoryTypeFilter
    );
    response = getAugmentedOptionWithLeadRepName(response, leadRepName);
    response = getAugmentedOptionWithOppRepName(response, oppRepName);

    response = filterBasedOnTabType({
      tabType,
      customTypeFilter,
      allOptions: response,
      entityType: type
    });
    const groupedByCategoryData = groupDataByCategory(response);
    const filteredOptions = filterOptions(groupedByCategoryData, searchText);
    return filteredOptions;
  } catch (error) {
    trackError('Error fetching activity category metadata:', error);
    return [];
  }
};
