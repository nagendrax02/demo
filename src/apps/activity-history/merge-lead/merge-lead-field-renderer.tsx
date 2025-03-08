import { ReactNode } from 'react';
import { DateRenderType } from 'apps/entity-details/types/entity-data.types';
import { DataType, RenderType, SchemaName } from 'common/types/entity/lead/metadata.types';
import Boolean from 'common/component-lib/entity-fields/boolean';
import MultiSelect from 'common/component-lib/entity-fields/multi-select';
import DateTime from 'common/component-lib/entity-fields/date-time';
import TextArea from 'common/component-lib/entity-fields/text-area';
import {
  IGenerateColumnsComponent,
  IGetCFSDataTypeElement,
  IGetComponentBasedOnDataType,
  IGetComponentBasedOnRenderType,
  IGetComponentBasedOnSchemaType,
  IRenderCellBasedOnFieldRenderType
} from './merge-lead-types';
import MergeLeadCFS, { PreviewNotAvailable } from './MergeLeadComponents';
import UserName from 'common/component-lib/user-name';
import { CallerSource } from 'common/utils/rest-client';

function getCFSDataTypeElement({
  fieldPropertyData,
  lead
}: IGetCFSDataTypeElement): JSX.Element | null {
  return <MergeLeadCFS lead={lead} fieldPropertyData={fieldPropertyData}></MergeLeadCFS>;
}

function getComponentBasedOnRenderType({
  fieldPropertyData
}: IGetComponentBasedOnRenderType): JSX.Element | null {
  if (!fieldPropertyData) return null;
  const fieldRenderTypeMapping = {
    [RenderType.Boolean]: <Boolean value={fieldPropertyData.value}></Boolean>,
    [RenderType.RadioButtons]: <Boolean value={fieldPropertyData.value}></Boolean>,
    [RenderType.Checkbox]: <Boolean value={fieldPropertyData.value}></Boolean>,
    [RenderType.MultiSelect]: <MultiSelect value={fieldPropertyData.value}></MultiSelect>,
    [RenderType.TextArea]: <TextArea value={fieldPropertyData.value} />,
    [RenderType.Datetime]: (
      <DateTime date={fieldPropertyData.value} renderType={DateRenderType.Datetime} />
    ),
    [RenderType.Time]: <DateTime date={fieldPropertyData.value} renderType={DateRenderType.Time} />,
    [RenderType.Date]: <DateTime date={fieldPropertyData.value} renderType={DateRenderType.Date} />
  };
  const componentToRender = fieldRenderTypeMapping[
    fieldPropertyData.fieldRenderType
  ] as JSX.Element;
  return componentToRender ?? null;
}

function getComponentBasedOnDataType({
  fieldPropertyData,
  lead
}: IGetComponentBasedOnDataType): JSX.Element | null {
  if (!fieldPropertyData) return null;
  const dataTypeMapping = {
    [DataType.CustomObject]: getCFSDataTypeElement({ fieldPropertyData, lead }),
    [DataType.File]: <PreviewNotAvailable></PreviewNotAvailable>,
    [DataType.ActiveUsers]: (
      <UserName id={fieldPropertyData.value} callerSource={CallerSource.ActivityHistory}></UserName>
    )
  };
  const componentToRender = dataTypeMapping[fieldPropertyData.dataType] as JSX.Element;
  return componentToRender ?? null;
}

function getComponentBasedOnSchemaType({
  fieldPropertyData
}: IGetComponentBasedOnSchemaType): JSX.Element | null {
  if (!fieldPropertyData) return null;
  const schemaTypeMapping = {
    [SchemaName.OwnerId]: '-',
    [SchemaName.RelatedCompanyId]: '-'
  };
  const componentToRender = schemaTypeMapping[fieldPropertyData.schemaName] as JSX.Element;
  return componentToRender ?? null;
}

function renderCellBasedOnFieldRenderType({
  fieldPropertyData,
  lead
}: IRenderCellBasedOnFieldRenderType): JSX.Element | null | string {
  if (!fieldPropertyData || !fieldPropertyData.value) return '-';
  let componentToRender = getComponentBasedOnRenderType({ fieldPropertyData, lead });
  if (componentToRender) return componentToRender;
  componentToRender = getComponentBasedOnDataType({ fieldPropertyData, lead });
  if (componentToRender) return componentToRender;
  componentToRender = getComponentBasedOnSchemaType({ fieldPropertyData, lead });
  if (componentToRender) return componentToRender;
  return fieldPropertyData.value;
}

function generateColumnsComponent({
  fieldPropertyData,
  lead
}: IGenerateColumnsComponent): string | ReactNode {
  if (fieldPropertyData?.schemaName) {
    const CellElement = renderCellBasedOnFieldRenderType({
      fieldPropertyData,
      lead
    });
    return CellElement;
  } else {
    return '-';
  }
}

export default generateColumnsComponent;
export { renderCellBasedOnFieldRenderType };
