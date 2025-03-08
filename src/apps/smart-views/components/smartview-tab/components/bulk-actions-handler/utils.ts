import { MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';
import { EntityType } from 'common/types';
import { ITabConfig } from '../../smartview-tab.types';
import { safeParseJson } from 'common/utils/helpers';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { getSeparatedLeadType } from 'apps/smart-views/augment-tab-data/common-utilities/utils';

export const getDescription = (
  leadRepName: string,
  oppRepName: string,
  selectedRowIds: string[]
): string => {
  const isPlural = selectedRowIds?.length > 1;
  return `Are you sure you want to delete the selected ${leadRepName}? All the ${oppRepName}, activities and files related to ${
    isPlural ? 'these' : 'this'
  } ${leadRepName} will also be deleted. This action cannot be undone.`;
};

export const getSelectedRowIds = (selectedRows: Record<string, unknown> | undefined): string[] => {
  if (selectedRows) {
    return Object.keys(selectedRows);
  }
  return [];
};

export const getCoreData = (
  entityType: EntityType,
  tabData: ITabConfig
): IEntityDetailsCoreData => {
  const coreData = safeParseJson(
    JSON.stringify(MOCK_ENTITY_DETAILS_CORE_DATA)
  ) as IEntityDetailsCoreData;
  coreData.entityDetailsType = entityType;
  coreData.entityIds.EntityTypeId = tabData.entityCode;
  coreData.entityRepNames.account = tabData.representationName;
  coreData.entityRepNames.opportunity = tabData.representationName;
  coreData.entityRepNames.lead = tabData.representationName;
  coreData.eventCode = parseInt(tabData.entityCode || '0') || undefined;
  coreData.leadType = getSeparatedLeadType(tabData?.leadTypeConfiguration);
  return coreData;
};

export const getRepresentationName = ({
  repName,
  text,
  value
}: {
  repName: string;
  text: string;
  value: string;
}): string => {
  return text.replace(value, repName);
};
