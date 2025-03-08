import { IRowData } from '@lsq/nextgen-preact/table/table.types';
import { PORTAL_SCHEMA_NAMES } from '../constants';
import { getProperty } from './utils';
import { DataType, RenderType } from '../../../types/entity/lead';
import { IEntityProperty } from '../../../types/entity/lead/metadata.types';

const isPortalActivity = (activityEventCode: string | undefined): boolean => {
  const portalEventCodes = ['21500'];
  if (portalEventCodes?.includes(activityEventCode || '')) return true;
  return false;
};

export const isPortalName = (
  rowData: IRowData,
  activityEventCode: string | undefined,
  columnKey: string
): boolean => {
  if (
    columnKey === 'Value' &&
    isPortalActivity(activityEventCode) &&
    rowData.SchemaName === PORTAL_SCHEMA_NAMES.PORTAL_NAME
  ) {
    return true;
  }
  return false;
};

export const isFormName = (
  rowData: IRowData,
  activityEventCode: string | undefined,
  columnKey: string
): boolean => {
  if (
    columnKey === 'Value' &&
    isPortalActivity(activityEventCode) &&
    rowData.SchemaName === PORTAL_SCHEMA_NAMES.FORM_NAME
  ) {
    return true;
  }
  return false;
};

export const getPortalNameProperty = (rowData: IRowData, value: string): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.PortalName,
    dataType: DataType.String,
    value,
    displayName: (rowData?.NewDisplayValue as string) || 'Portal'
  });
};

export const getFormNameProperty = (rowData: IRowData, value: string): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.FormName,
    dataType: DataType.String,
    value,
    displayName: (rowData?.NewDisplayValue as string) || 'Form'
  });
};
