import { HeaderAction, SCHEMA_NAMES, TabType } from 'apps/smart-views/constants/constants';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { selectedSalesActivity } from 'apps/smart-views/augment-tab-data/activity/constants';
import {
  ADDRESS,
  COORDINATES,
  redundantAccountBaseTableType,
  redundantAccountField,
  redundantOpportunityFields
} from '../constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

interface IGetFilteredFields {
  tabType: TabType;
  selectedAction: IMenuItem | null;
  fields: IAvailableColumnConfig[];
  entityCode?: string;
}

const getFilteredLeadFields = (fields: IAvailableColumnConfig[]): IAvailableColumnConfig[] => {
  const filteredFields = fields?.[0]?.data?.filter((filed) => filed?.dataType !== DataType.File);
  return [
    {
      ...fields[0],
      data: filteredFields
    }
  ];
};

const getFilteredActivityFields = (fields: IAvailableColumnConfig[]): IAvailableColumnConfig[] => {
  const filteredField = fields?.map((field) => {
    return {
      ...field,
      data: field?.data.filter(
        (member) =>
          !(
            member?.dataType === DataType.File ||
            (member.renderType === RenderType.Lead && member.isCFS)
          )
      )
    };
  });

  return filteredField;
};

const getFilteredOpportunityFields = (
  fields: IAvailableColumnConfig[]
): IAvailableColumnConfig[] => {
  const filteredField = fields?.map((field) => {
    return {
      ...field,
      data: field?.data.filter(
        (member) =>
          !(
            member?.dataType === DataType.File ||
            (member.renderType === RenderType.Lead && member.isCFS) ||
            redundantOpportunityFields.includes(member?.schemaName)
          )
      )
    };
  });

  return filteredField;
};

const getFilteredColumnLeadFields = (
  fields: IAvailableColumnConfig[],
  entityCode?: string
): IAvailableColumnConfig[] => {
  if (selectedSalesActivity.includes(entityCode || '')) {
    const filteredField = fields?.map((field) => {
      if (field?.type === TabType.Activity) {
        field.data = field?.data?.filter((filed) => filed.ShowInForm);
      }
      return field;
    });
    return filteredField;
  }

  return fields;
};

const handleRedundantFieldCheck = (currField: IAvailableField): boolean => {
  return redundantAccountField.includes(currField?.schemaName);
};

const handleBaseTableTypeCheck = (currField: IAvailableField): boolean => {
  return currField?.BaseTable === redundantAccountBaseTableType.BASE_TABLE;
};

const canIncludeInAccountFields = (currField: IAvailableField): boolean => {
  return handleRedundantFieldCheck(currField) || handleBaseTableTypeCheck(currField);
};

const getUpdatedAccountData = (fields: IAvailableField[]): IAvailableField[] => {
  const normalizeMetaData: IAvailableField[] = [];
  fields?.forEach((currField) => {
    if (canIncludeInAccountFields(currField)) {
      return;
    }
    if (currField?.schemaName === SCHEMA_NAMES.OWNER_ID) {
      currField = { ...currField, schemaName: SCHEMA_NAMES.OWNER_NAME };
    }
    if (currField?.dataType === DataType.GeoLocation) {
      currField = currField?.GroupName?.includes(ADDRESS)
        ? {
            ...currField,
            displayName: `${currField?.displayName}${ADDRESS}`
          }
        : {
            ...currField,
            displayName: `${currField?.displayName}${COORDINATES}`
          };
    }
    normalizeMetaData.push({ ...currField });
  });

  return normalizeMetaData;
};

const getFilteredAccountFields = (fields: IAvailableColumnConfig[]): IAvailableColumnConfig[] => {
  const filteredField = fields?.map((field) => {
    return {
      ...field,
      data: getUpdatedAccountData(field?.data)
    };
  });

  return filteredField;
};

const getFilteredFieldsForExport = (
  fields: IAvailableColumnConfig[],
  tabType: TabType
): IAvailableColumnConfig[] => {
  switch (tabType) {
    case TabType.Lead:
      return getFilteredLeadFields(fields);
    case TabType.Activity:
      return getFilteredActivityFields(fields);
    case TabType.Account:
      return getFilteredAccountFields(fields);
    case TabType.Opportunity:
      return getFilteredOpportunityFields(fields);
    default:
      return fields;
  }
};

const getFilteredFieldsForSelectColumns = (
  fields: IAvailableColumnConfig[],
  tabType: TabType,
  entityCode?: string
): IAvailableColumnConfig[] => {
  switch (tabType) {
    case TabType.Activity:
      return getFilteredColumnLeadFields(fields, entityCode);
    default:
      return fields;
  }
};

export const getFilteredFields = (props: IGetFilteredFields): IAvailableColumnConfig[] => {
  const { tabType, selectedAction, fields, entityCode } = props;

  const isExportAction = selectedAction?.value === HeaderAction.ExportLeads;
  const isSelectColumnsAction = selectedAction?.value === HeaderAction.SelectColumns;

  if (isExportAction) {
    return getFilteredFieldsForExport(fields, tabType);
  } else if (isSelectColumnsAction) {
    return getFilteredFieldsForSelectColumns(fields, tabType, entityCode);
  }
  return fields;
};

export const getSearchTextHighlightedField = (
  value: string,
  searchText: string,
  color?: string
): JSX.Element => {
  if (!searchText) return <span>{value}</span>;

  const lowerCaseResult = value.toLowerCase();
  const lowerCaseSearchText = searchText.toLowerCase();
  const startIndex = lowerCaseResult.indexOf(lowerCaseSearchText);

  if (startIndex === -1) {
    return <span>{value}</span>;
  }

  const beforeMatch = value.substring(0, startIndex);
  const match = value.substring(startIndex, startIndex + searchText.length);
  const afterMatch = value.substring(startIndex + searchText.length);

  return (
    <span>
      {beforeMatch}
      <span style={{ color: color ?? 'rgb(var(--ng-ink-blue-50))' }}>{match}</span>
      {afterMatch}
    </span>
  );
};

export const getSelectedColumnsTitle = ({
  title,
  selectedAction,
  entityRepName,
  matchedFields
}: {
  title: string;
  selectedAction: IMenuItem | null;
  entityRepName: IEntityRepresentationName;
  matchedFields: IAvailableColumnConfig[];
}): string => {
  if (matchedFields?.length === 1 && selectedAction?.value === HeaderAction.SelectColumns) {
    return title?.replaceAll('{{EntityName}}', entityRepName?.SingularName ?? 'Lead');
  }
  return title?.replaceAll('{{EntityName}}', '');
};

export const getSearchTitle = (data: IAvailableColumnConfig[]): string => {
  if (data?.[0]?.data?.length === 0) {
    return '';
  }
  return `${data?.[0]?.data?.length} Result${data?.[0]?.data?.length === 1 ? '' : 's'} found`;
};
