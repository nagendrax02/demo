import { trackError } from 'common/utils/experience/utils/track-error';
import { getFormattedDateTime } from 'common/utils/date';
import { IChangeLog, IField, IFieldRow, IChangeLogRow } from '../../activity-table.types';
import * as constants from '../../constants';

export const handleFieldDataType = (field: IField, baseRow: IFieldRow) => {
  const dataTypes = [
    constants.FIELD.NUMBER,
    constants.FIELD.STRING,
    constants.FIELD.PRODUCT,
    constants.FIELD.SEARCHABLE_DROPDOWN,
    constants.FIELD.DROPDOWN,
    constants.FIELD.AUDIO_PLAYER
  ];
  if (dataTypes.includes(field.DataType)) {
    return { ...baseRow, Value: field.Value };
  }
  if (field.DataType === constants.FIELD.DATE_TIME) {
    return {
      ...baseRow,
      DisplayName: field.DisplayName,
      Value: field.Value
    };
  }
  if (field.DataType === constants.FIELD.FILE) {
    return {
      ...baseRow,
      DisplayName: field.DisplayName,
      Value: constants.VIEW_FILES,
      FilesCSV: field?.Value,
      IsFile: true,
      SchemaName: field?.SchemaName,
      CustomObjectSchemaName: field?.CFSSchemaName,
      ActivityId: field?.ActivityId
    };
  }
  return {
    ...baseRow,
    Value: field?.Value
  };
};

export const createFieldRow = (field: IField) => {
  const baseRow = {
    ...field,
    DisplayName: field?.DisplayName,
    IsCFS: field?.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD
  };

  const dataTypes = [
    constants.FIELD.CUSTOM_OBJECT_FILES,
    constants.FIELD.CUSTOM_OBJECT,
    constants.FIELD.ACTIVE_USERS
  ];

  if (
    field?.Value &&
    (field?.ShowInForm || field?.IsMandatory) &&
    !dataTypes.includes(field?.DataType)
  ) {
    return handleFieldDataType(field, baseRow);
  }

  if (field.DataType === constants.FIELD.CUSTOM_OBJECT) {
    return { ...baseRow, Value: '', IsHeading: true };
  }

  if (field.DataType === constants.FIELD.CUSTOM_OBJECT_FILES) {
    return {
      ...baseRow,
      DisplayName: constants.DOWNLOAD_FILES,
      Value: '',
      IsFile: true,
      IsHeading: true
    };
  }

  if (field.DataType === constants.FIELD.FILE) {
    return { ...baseRow, Value: constants.NOT_UPLOADED };
  }

  if (field.DataType === constants.FIELD.ACTIVE_USERS && field.Value) {
    return { ...baseRow, Value: field.Value || '' };
  }

  return [];
};

const getCustomFields = (item: IField, id: string, eventCode: number, leadId?: string) => {
  if (item.Fields?.length) {
    const custom = item.Fields?.map((customFields) => {
      return {
        ...customFields,
        CFSSchemaName: customFields.SchemaName,
        SchemaName: item.SchemaName,
        InternalName: constants.FIELD.CUSTOM_OBJECT_FIELD,
        ActivityId: id,
        ActivityEventCode: eventCode,
        leadId
      };
    });
    return [{ ...item, Fields: null }, ...custom];
  }
  return { ...item };
};

export const getDefaultRowConfig = (
  fields: IField[],
  id: string,
  eventCode: number,
  leadId?: string
): IFieldRow[] => {
  try {
    let fieldData: IField[] = fields?.map((item) =>
      getCustomFields(item, id, eventCode, leadId)
    ) as IField[];
    fieldData = fieldData?.flat();

    const row: IFieldRow[] = fieldData.flatMap((field) => {
      if (field?.IsVisible) {
        return {
          ...field,
          DisplayName: field.DisplayName,
          Value: field.DataType === constants.FIELD.CUSTOM_OBJECT ? '' : field?.Value || '',
          IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD,
          IsHeading: field.DataType === constants.FIELD.CUSTOM_OBJECT
        };
      }
      return createFieldRow(field);
    });

    return row;
  } catch (error) {
    trackError('failed to fetch custom activity row config', error);
    return [];
  }
};

export const getNewAndOldValueRowConfig = (fields: IChangeLog[]): IChangeLogRow[] => {
  const fieldData = fields || [];

  const row = fieldData.map((field: IChangeLog) => {
    if (field.DataType === constants.FIELD.DATE_TIME) {
      return {
        ...field,
        DisplayName: field.DisplayName,
        OldValue: getFormattedDateTime({ date: field.OldValue as string }),
        NewValue: getFormattedDateTime({ date: field.NewValue as string })
      };
    } else {
      return {
        ...field,
        DisplayName: field.DisplayName,
        OldValue: field.OldValue,
        NewValue: field.NewValue
      };
    }
  });

  return row;
};

export const getFormSavedAsDraftOnPortalRowConfig = (
  fields: IField[],
  id: string,
  eventCode: number,
  leadId?: string
): IFieldRow[] => {
  try {
    const defaultRows = getDefaultRowConfig(fields, id, eventCode, leadId);
    const lastModifiedOnField = fields?.find((field) => field?.DisplayName === 'Modified On');
    if (lastModifiedOnField) {
      defaultRows?.push({
        DisplayName: 'Last Modified On',
        Value: lastModifiedOnField?.Value,
        DataType: lastModifiedOnField?.DataType
      });
    }
    const createdOnField = fields?.find((field) => field?.DisplayName === 'Created On');
    if (createdOnField) {
      defaultRows?.push({
        DisplayName: 'Created On',
        Value: createdOnField?.Value,
        DataType: createdOnField?.DataType
      });
    }

    return defaultRows;
  } catch (error) {
    trackError(error);
    return [];
  }
};
