/* eslint-disable @typescript-eslint/naming-convention */
import { RenderType, DataType, IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { getRestrictedData } from 'common/utils/permission-manager';
import {
  IEntityPermissionAccess,
  PermissionEntityType,
  ActionType,
  AccessType
} from 'common/utils/permission-manager/permission-manager.types';
import { IRowData } from '@lsq/nextgen-preact/table/table.types';
import {
  NO_NAME,
  COLUMN_KEY,
  USER_SCHEMA_NAME,
  SCHEMA_NAME,
  FIELD,
  DATATYPE,
  AUDIO_PLAYER,
  VIEW_FILES
} from '../constants';
import { IAdditionalDetails, IChangeLogRow, IFieldRow } from '../activity-table.types';
import { OPPORTUNITY } from 'apps/activity-history/constants';
import { CallerSource } from 'common/utils/rest-client';
import {
  getFormNameProperty,
  getPortalNameProperty,
  isFormName,
  isPortalName
} from './portal-utils';

export interface IGetProperty {
  rowData: IRowData;
  fieldRenderType: RenderType;
  dataType: DataType;
  value?: string;
  additionalDetails?: IAdditionalDetails;
  displayName?: string;
}

export const getProperty = ({
  rowData,
  fieldRenderType,
  dataType,
  value,
  additionalDetails,
  displayName
}: IGetProperty): IEntityProperty => {
  return {
    id: rowData.SchemaName as string,
    name: displayName || (rowData.DisplayName as string),
    value: value || (rowData.Value as string),
    fieldRenderType: fieldRenderType,
    schemaName: rowData.SchemaName as string,
    dataType: dataType,
    /* isActivity when true is used to send EntityId in payload while fetching file data. 
       EntityId should be true in cases where activity is opportunity related, otherwise API return empty file list.
    */
    isActivity: [
      additionalDetails?.ActivityEntityType,
      additionalDetails?.RelatedActivityEntityType
    ].includes(OPPORTUNITY)
  };
};

export const getUserNameProperty = (rowData: IRowData): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.UserName,
    dataType: DataType.ActiveUsers
  });
};

export const getLeadProperty = (rowData: IRowData): IEntityProperty => {
  return {
    ...getProperty({
      rowData,
      fieldRenderType: RenderType.Lead,
      dataType: DataType.Lead,
      value: (rowData?.Value || rowData.LeadId || rowData.ActivityId) as string
    }),
    name: (rowData.DisplayValue as string) || NO_NAME
  };
};

const getDataType = (columnKey: string): DataType => {
  if (columnKey === COLUMN_KEY.DISPLAY_NAME) {
    return DataType.Text;
  }
  return DataType.Lead;
};

const getRenderType = (columnKey: string): RenderType => {
  if (columnKey === COLUMN_KEY.DISPLAY_NAME) {
    return RenderType.Text;
  }
  return RenderType.Lead;
};

const getValue = (columnKey: string, rowData: IRowData): string => {
  if (columnKey === COLUMN_KEY.DISPLAY_NAME) {
    return rowData?.DisplayName as string;
  }
  if (columnKey === COLUMN_KEY.NEW_VALUE) {
    return rowData?.NewValue as string;
  }
  return (rowData?.OldValue as string) || '';
};

const getName = (columnKey: string, rowData: IRowData): string => {
  if (columnKey === COLUMN_KEY.DISPLAY_NAME) {
    return rowData?.DisplayName as string;
  }
  if (columnKey === COLUMN_KEY.NEW_VALUE) {
    return rowData?.NewDisplayValue as string;
  }
  if (columnKey === COLUMN_KEY.OLD_VALUE) {
    return (rowData?.OldDisplayValue as string) || '';
  }

  return NO_NAME;
};

export const getCustomObjectLeadProperty = (
  rowData: IRowData,
  columnKey: string
): IEntityProperty => {
  return {
    ...getProperty({
      rowData,
      fieldRenderType: getRenderType(columnKey),
      dataType: getDataType(columnKey),
      value: getValue(columnKey, rowData)
    }),
    name: getName(columnKey, rowData)
  };
};

export const getUrlProperty = (rowData: IRowData): IEntityProperty => {
  return getProperty({ rowData, fieldRenderType: RenderType.URL, dataType: DataType.Url });
};

export const getFileProperty = (
  rowData: IRowData,
  additionalDetails?: IAdditionalDetails
): IEntityProperty => {
  return {
    ...getProperty({
      rowData,
      fieldRenderType: RenderType.File,
      dataType: DataType.File,
      value: rowData.FilesCSV as string,
      additionalDetails
    }),
    parentSchemaName: rowData.SchemaName as string,
    isCFSField: rowData.IsCFS as boolean,
    entityId: (rowData.ActivityId || rowData.LeadId || rowData.leadId) as string,
    schemaName: (rowData?.CustomObjectSchemaName as string) || '',
    leadId: (rowData.LeadId || rowData.leadId) as string
  };
};

export const getAudioProperty = (rowData: IRowData): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.Audio,
    dataType: DataType.Audio,
    value: rowData.resourceUrl as string
  });
};

const getCustomDateValue = (columnKey: string, rowData: IRowData): string => {
  if (columnKey === COLUMN_KEY.NEW_VALUE) {
    return rowData?.NewValue as string;
  }
  if (columnKey === COLUMN_KEY.OLD_VALUE) {
    return (rowData?.OldValue as string) || '';
  }
  return (rowData?.Value as string) || '';
};

export const getDateProperty = (columnKey: string, rowData: IRowData): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.Date,
    dataType: DataType.Date,
    value: getCustomDateValue(columnKey, rowData)
  });
};

export const getDateTimeProperty = (columnKey: string, rowData: IRowData): IEntityProperty => {
  return getProperty({
    rowData,
    fieldRenderType: RenderType.DateTime,
    dataType: DataType.DateTime,
    value: getCustomDateValue(columnKey, rowData)
  });
};

const isUserDataType = (columnKey: string, schemaName?: string, dataType?: string): boolean => {
  if (
    ((schemaName && USER_SCHEMA_NAME.includes(schemaName)) || dataType === FIELD.ACTIVE_USERS) &&
    columnKey === COLUMN_KEY.VALUE
  )
    return true;
  return false;
};

const isOppSchemaName = (columnKey: string, rowData: IRowData): boolean => {
  if (
    columnKey === COLUMN_KEY.VALUE &&
    rowData.SchemaName === SCHEMA_NAME.OPPORTUNITY_DISPLAY_NAME &&
    rowData.activityId &&
    rowData.activityEventCode &&
    rowData.isOpportunity
  )
    return true;
  return false;
};

const isLeadDataType = (columnKey: string, dataType: string): boolean => {
  return columnKey === COLUMN_KEY.VALUE && dataType === DATATYPE.LEAD;
};

const isViewFile = (isFile: boolean, value: string): boolean => {
  return !!(isFile && value === VIEW_FILES);
};

const isAudioFile = (value: string, resourceUrl: string): boolean => {
  return !!(value === AUDIO_PLAYER && resourceUrl);
};

const isDateTimeDataType = (columnKey: string, dataType: string): boolean => {
  return columnKey === COLUMN_KEY.VALUE && dataType === DATATYPE.DATE_TIME;
};

const isDateDataType = (columnKey: string, dataType: string): boolean => {
  return columnKey === COLUMN_KEY.VALUE && dataType === DATATYPE.Date;
};

const isCustomDateTimeDataType = (columnKey: string, dataType: string): boolean => {
  return (
    (columnKey === COLUMN_KEY.OLD_VALUE || columnKey === COLUMN_KEY.NEW_VALUE) &&
    dataType === 'CustomObjectField-DateTime'
  );
};

const isCustomDateDataType = (columnKey: string, dataType: string): boolean => {
  return (
    (columnKey === COLUMN_KEY.OLD_VALUE || columnKey === COLUMN_KEY.NEW_VALUE) &&
    dataType === 'CustomObjectField-Date'
  );
};

export const getDateTypeEntityProperty = (
  columnKey: string,
  rowData: IRowData
): IEntityProperty | undefined => {
  if (isDateTimeDataType(columnKey, rowData.DataType as string)) {
    return getDateTimeProperty(columnKey, rowData);
  }
  if (isDateDataType(columnKey, rowData.DataType as string)) {
    return getDateProperty(columnKey, rowData);
  }
  if (isCustomDateTimeDataType(columnKey, rowData?.DataType as string)) {
    return getDateTimeProperty(columnKey, rowData);
  }
  if (isCustomDateDataType(columnKey, rowData.DataType as string)) {
    return getDateProperty(columnKey, rowData);
  }
};

const stringRenderTypes = {
  [RenderType.String1000]: true,
  [RenderType.StringTextArea]: true
};

const getHtmlDataTypeEntityProperty = (
  columnKey: string,
  rowData: IRowData,
  value: string
): IEntityProperty | undefined => {
  if (stringRenderTypes[rowData?.StringRenderType as string]) {
    return {
      ...getProperty({
        rowData,
        fieldRenderType: rowData.StringRenderType as RenderType,
        dataType: DataType.String,
        value: value
      })
    };
  }
  if (
    ((rowData?.StringRenderType as string) === 'String_TextContent_CMS' ||
      rowData.SchemaName === DataType.ActivityEvent_Note) &&
    columnKey !== 'DisplayName'
  ) {
    return {
      ...getProperty({
        rowData,
        fieldRenderType: RenderType.HTML,
        dataType: DataType.String,
        value: value
      })
    };
  }
  return undefined;
};

interface IGetEntityProperty {
  columnKey: string;
  rowData: IRowData;
  additionalDetails?: IAdditionalDetails | undefined;
  activityEventCode?: string;
}

// eslint-disable-next-line complexity
export const getEntityProperty = ({
  columnKey,
  rowData,
  additionalDetails,
  activityEventCode
}: IGetEntityProperty): IEntityProperty | undefined => {
  const value = rowData[columnKey] as string;
  if (isPortalName(rowData, activityEventCode, columnKey)) {
    return getPortalNameProperty(rowData, value);
  }
  if (isFormName(rowData, activityEventCode, columnKey)) {
    return getFormNameProperty(rowData, value);
  }
  if (isUserDataType(columnKey, rowData.SchemaName as string, rowData.DataType as string)) {
    return getUserNameProperty(rowData);
  }
  if (isLeadDataType(columnKey, rowData.DataType as string)) {
    return getLeadProperty(rowData);
  }
  if (isOppSchemaName(columnKey, rowData)) {
    return getUrlProperty(rowData);
  }
  if (rowData.DataType === DATATYPE.CUSTOM_OBJECT_LEAD) {
    return getCustomObjectLeadProperty(rowData, columnKey);
  }
  if (isViewFile(rowData.IsFile as boolean, value)) {
    return getFileProperty(rowData, additionalDetails);
  }
  if (isAudioFile(value, rowData.resourceUrl as string)) {
    return getAudioProperty(rowData);
  }
  const dateTypeEntityProperty = getDateTypeEntityProperty(columnKey, rowData);
  if (dateTypeEntityProperty) return dateTypeEntityProperty;

  const htmlDataTypeEntityProperty = getHtmlDataTypeEntityProperty(columnKey, rowData, value);
  if (htmlDataTypeEntityProperty) return htmlDataTypeEntityProperty;

  return undefined;
};

export const getFileFields = (
  fieldsData: IFieldRow[] | undefined,
  viewRestriction: IEntityPermissionAccess | null
): IFieldRow[] => {
  if (!fieldsData?.length || viewRestriction?.accessType === AccessType.NoAccess) {
    return [];
  }
  const restrictedFields = fieldsData.filter(
    (field) =>
      field?.IsFile &&
      field?.SchemaName &&
      viewRestriction?.accessType === AccessType.PartialAccess &&
      viewRestriction?.RestrictedFields?.[field.SchemaName]
  );
  if (restrictedFields.length) return [];

  return fieldsData.flatMap((field) => {
    if (field?.IsFile && field?.SchemaName && field?.CustomObjectSchemaName) {
      return {
        ...field,
        dataType: DataType.File,
        value: field.FilesCSV as string,
        schemaName: field?.CustomObjectSchemaName as string
      };
    }
    return [];
  });
};

export const getViewRestriction = async ({
  eventCode,
  callerSource,
  activityEntityType,
  enablePermissionCheck
}: {
  eventCode: number;
  callerSource: CallerSource;
  activityEntityType?: string;
  enablePermissionCheck?: boolean;
}): Promise<IEntityPermissionAccess | null> => {
  if (eventCode && enablePermissionCheck && activityEntityType === SCHEMA_NAME.OPPORTUNITY) {
    const viewRestriction: IEntityPermissionAccess = await getRestrictedData({
      entityType: PermissionEntityType.Opportunity,
      actionType: ActionType.Access,
      entityId: `${eventCode}`,
      callerSource
    });
    return viewRestriction;
  }
  return null;
};

const entities: { [key: string]: string } = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#8203;': ''
};

const decodeHTMLEntities = (text: string | number): string | number => {
  if (typeof text === 'string') {
    return text?.replace(/&[^;]+;/g, (match) => entities[match] || match);
  }
  return text;
};

export const getAugmentedData = (
  processedFieldsData: IFieldRow[] | IChangeLogRow[]
): IFieldRow[] | IChangeLogRow[] => {
  if (processedFieldsData) {
    processedFieldsData?.forEach((data: IFieldRow | IChangeLogRow) => {
      if (data?.DataType === DataType.CustomObjectFieldString) {
        data.NewValue = decodeHTMLEntities(data?.NewValue || '');
        data.OldValue = decodeHTMLEntities(data?.OldValue || '');
      }
    });
  }
  return processedFieldsData;
};
