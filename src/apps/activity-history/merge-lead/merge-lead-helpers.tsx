import { trackError } from 'common/utils/experience/utils/track-error';
import { CallerSource, Module, httpGet } from 'common/utils/rest-client';
import {
  IGetChildLeads,
  IGenerateSectionColumnsConfig,
  ISectionData,
  IColumnData,
  IChildLeadData,
  IRowData,
  IHeaderData,
  IGetLeadNameBasedOnProperties
} from './merge-lead-types';
import {
  IAugmentedAttributeFields,
  IAugmentedAttributes
} from 'apps/entity-details/types/entity-data.types';
import generateColumnsComponent from './merge-lead-field-renderer';
import { DataType, IField, ILeadAttribute } from 'common/types/entity/lead';
import { ReactNode } from 'react';
import { LeadColumnHeading } from './MergeLeadComponents';
import { API_ROUTES } from 'common/constants';
import { MERGE_LEAD_CFS, MERGE_LEAD_COLUMN } from './constants';

const getChildLeads = async ({
  prospectAuditId
}: IGetChildLeads): Promise<IChildLeadData[] | void> => {
  try {
    const childLeads: IChildLeadData[] = await httpGet({
      path: `${API_ROUTES.childMergedLead}${prospectAuditId}`,
      module: Module.V1,
      callerSource: CallerSource.ActivityHistory
    });
    return childLeads;
  } catch (err) {
    trackError(err);
  }
};

interface IGenerateColumnDataForLeads {
  fieldPropertyMap: Map<string, IAugmentedAttributeFields>;
  lead: IChildLeadData;
  row: IRowData;
  fieldProperty: IField;
  fieldPropertyData: ILeadAttribute;
}

function isFieldCFS(fieldPropertyData: ILeadAttribute): boolean {
  if (fieldPropertyData) {
    const isCfsField = fieldPropertyData
      ? fieldPropertyData?.DataType === DataType.CustomObject
      : false;
    return isCfsField;
  }
  return false;
}

function generateColumnDataForLeads({
  fieldPropertyMap,
  lead,
  row,
  fieldProperty,
  fieldPropertyData
}: IGenerateColumnDataForLeads): void {
  const fieldAttribute = fieldPropertyMap.get(fieldProperty.SchemaName);
  if (fieldAttribute) {
    fieldAttribute.value = lead[fieldProperty?.SchemaName];
    const customCSSName = `${MERGE_LEAD_COLUMN} ${
      isFieldCFS(fieldPropertyData) ? MERGE_LEAD_CFS : ''
    }`;
    const column: IColumnData = {
      dataToShow:
        generateColumnsComponent({
          fieldPropertyData: fieldAttribute,
          lead
        }) ?? '-',
      className: customCSSName
    };
    row.columns.push(column);
  }
}

interface IGenerateFirstColumn {
  row: IRowData;
  fieldPropertyData: ILeadAttribute;
  fieldProperty: IField;
}

function generateFirstColumn({
  row,
  fieldPropertyData,
  fieldProperty
}: IGenerateFirstColumn): void {
  row.columns.push({
    dataToShow: (fieldPropertyData?.DisplayName as string) ?? fieldProperty?.DisplayName,
    className: `${MERGE_LEAD_COLUMN}`
  });
}

function generateSectionColumn({
  section,
  childLeadData,
  fieldPropertyMap,
  leadMetadataMap
}: IGenerateSectionColumnsConfig): ISectionData | null {
  if (!childLeadData || !section) return null;
  const rows: IRowData[] = [];
  if (childLeadData.length) {
    for (const fieldProperty of section.Fields) {
      const row: IRowData = { columns: [] };
      const fieldPropertyData = leadMetadataMap?.[fieldProperty?.SchemaName] as ILeadAttribute;
      generateFirstColumn({
        row,
        fieldProperty,
        fieldPropertyData
      });
      for (const lead of childLeadData) {
        generateColumnDataForLeads({
          lead,
          fieldProperty,
          fieldPropertyMap,
          row,
          fieldPropertyData
        });
      }
      rows.push(row);
    }
  }
  const header = section.DisplayName;
  const sectionData: ISectionData = {
    header,
    rows
  };
  return sectionData;
}
interface IGenerateHeaderColumn {
  childLeadData: IChildLeadData[];
  leadRepName: string;
}

function generateLeadColumnHeading(leadColumnData: string | ReactNode): JSX.Element {
  return <LeadColumnHeading leadColumnData={leadColumnData}></LeadColumnHeading>;
}

function getLeadNameBasedOnProperties({
  displayPropertiesOrder,
  childLeadData
}: IGetLeadNameBasedOnProperties): string {
  if (!displayPropertiesOrder?.length || !childLeadData) return '';
  for (const displayProperty of displayPropertiesOrder) {
    const displayName = childLeadData?.[displayProperty];
    if (displayName) {
      return displayName;
    }
  }
  return '';
}

function generateHeaderColumn({ childLeadData, leadRepName }: IGenerateHeaderColumn): IHeaderData {
  const row: IRowData = {
    columns: [
      {
        dataToShow: `${leadRepName} Fields`
      }
    ]
  };
  for (const childLead of childLeadData) {
    const leadDisplayName = getLeadNameBasedOnProperties({
      displayPropertiesOrder: ['FirstName', 'EmailAddress', 'Phone'],
      childLeadData: childLead
    });

    const column: IColumnData = {
      dataToShow: generateLeadColumnHeading(leadDisplayName)
    };
    row.columns.push(column);
  }
  return {
    row
  };
}

function schemanameToAttributeMap(
  augmentedAttributes: IAugmentedAttributes[]
): Map<string, IAugmentedAttributeFields> {
  const attributeMap: Map<string, IAugmentedAttributeFields> = new Map();
  if (augmentedAttributes?.length) {
    for (const attribute of augmentedAttributes) {
      if (!attribute?.fields?.length) continue;
      for (const fieldData of attribute?.fields as IAugmentedAttributeFields[]) {
        attributeMap.set(fieldData.schemaName, fieldData);
      }
    }
  }
  return attributeMap;
}

export { generateSectionColumn, getChildLeads, generateHeaderColumn, schemanameToAttributeMap };
