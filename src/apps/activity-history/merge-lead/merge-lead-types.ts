import { ReactNode } from 'react';
import { IAugmentedAttributeFields } from 'src/apps/entity-details/types/entity-data.types';
import { ILeadAttribute, ISection } from 'src/common/types/entity/lead';

interface IGetChildLeads {
  prospectAuditId: string;
}

interface IColumnData {
  dataToShow: string | ReactNode;
  className?: string;
}

interface IRowData {
  columns: IColumnData[];
}

interface ISectionData {
  header?: ReactNode | string;
  rows: IRowData[];
}

interface IHeaderData {
  row: IRowData;
}

interface IGenerateSectionColumnsConfig {
  section: ISection;
  childLeadData: IChildLeadData[];
  fieldPropertyMap: Map<string, IAugmentedAttributeFields>;
  leadMetadataMap: Record<string, ILeadAttribute>;
  userRole: string;
}

interface IFieldColumnData {
  fieldPropertyData: IAugmentedAttributeFields;
  lead: IChildLeadData;
}
interface IGenerateColumnsComponent extends IFieldColumnData {
  lead: IChildLeadData;
}

interface IRenderCellBasedOnFieldRenderType extends IFieldColumnData {
  lead: IChildLeadData;
}

interface IGetCFSDataTypeElement extends IFieldColumnData {
  lead: IChildLeadData;
}

type IGetComponentBasedOnRenderType = IFieldColumnData;

interface IGetComponentBasedOnDataType extends IFieldColumnData {
  lead: IChildLeadData;
}

type IGetComponentBasedOnSchemaType = IFieldColumnData;

type IChildLeadData = Record<string, string>;

interface IGenerateCFSFieldRowsData {
  sectionData: ISectionData[] | null;
  headerData: IHeaderData | null;
}

interface IGetLeadNameBasedOnProperties {
  displayPropertiesOrder: string[];
  childLeadData: IChildLeadData;
}

export type {
  IGetChildLeads,
  IColumnData,
  ISectionData,
  IGenerateSectionColumnsConfig,
  IChildLeadData,
  IRowData,
  IHeaderData,
  IGenerateColumnsComponent,
  IRenderCellBasedOnFieldRenderType,
  IGetCFSDataTypeElement,
  IGetComponentBasedOnRenderType,
  IGetComponentBasedOnDataType,
  IGetComponentBasedOnSchemaType,
  IGenerateCFSFieldRowsData,
  IGetLeadNameBasedOnProperties
};
