/* eslint-disable max-lines-per-function */
import { IActivityFields } from './activity-details.types';
import { ActivityBaseAttributeDataType, DataType } from 'common/types/entity/lead';
import {
  CREATED_BY_DISPLAY_NAME,
  CREATED_BY_EMAIL_NAME,
  MODIFIED_BY_DISPLAY_NAME,
  MODIFIED_BY_EMAIL_NAME,
  OWNER_EMAIL_DISPLAY_NAME,
  OWNER_SCHEMA_NAME
} from './constants';
import { ACTIVITY, activityType } from 'apps/activity-history/constants';
import { getFormattedDateTimeForAmPmValue } from '@lsq/nextgen-preact/date/utils';

const indexOfSchemaName = (
  fields: IActivityFields[],
  schemaName: string,
  propertyName?: string
): number => {
  return fields?.findIndex((currField) => {
    return propertyName
      ? currField[propertyName] === schemaName
      : currField?.SchemaName === schemaName;
  });
};

export const augumentActivityFields = (fields: IActivityFields[]): IActivityFields[] => {
  return fields?.map((field) => {
    if (field?.DataType?.toLowerCase() === DataType.DateTime?.toLowerCase()) {
      return { ...field, Value: getFormattedDateTimeForAmPmValue(field?.Value) };
    } else if (
      field?.DataType?.toLowerCase() === DataType.String?.toLowerCase() &&
      field?.StringRenderType
    ) {
      return {
        ...field,
        DataType: field?.StringRenderType as ActivityBaseAttributeDataType
      };
    } else if (field?.DataType?.toLowerCase() === DataType.CustomObject?.toLowerCase()) {
      return { ...field, Fields: augumentActivityFields(field.Fields) };
    }
    return field;
  });
};

const getNewFieldObject = (
  fields: IActivityFields[],
  index: number,
  emailSchemaName: string
): IActivityFields => {
  const oldField = fields[index] as IActivityFields;
  const emailField = fields?.filter((currField) => currField?.DisplayName === emailSchemaName)[0];
  if (oldField) {
    oldField.userEmail = emailField?.Value || '';
  }
  return oldField;
};

const removeField = (
  fields: IActivityFields[],
  propertyValue: string,
  propertyName: string
): IActivityFields[] => {
  const indexOfEmailField = indexOfSchemaName(fields, propertyValue, propertyName);
  if (indexOfEmailField !== -1) {
    fields.splice(indexOfEmailField, 1);
  }
  return fields;
};

export const handleUserFields = (fields: IActivityFields[]): IActivityFields[] => {
  const indexOfOwner = indexOfSchemaName(fields, OWNER_SCHEMA_NAME);
  if (fields?.length && indexOfOwner !== -1) {
    const modifiedFieldObject = getNewFieldObject(fields, indexOfOwner, OWNER_EMAIL_DISPLAY_NAME);
    fields[indexOfOwner] = modifiedFieldObject;
    fields = removeField(fields, OWNER_EMAIL_DISPLAY_NAME, 'DisplayName');
  }
  const indexOfCreatedBy = indexOfSchemaName(fields, CREATED_BY_DISPLAY_NAME, 'DisplayName');
  if (fields?.length && indexOfCreatedBy !== -1) {
    const modifiedFieldObject = getNewFieldObject(fields, indexOfCreatedBy, CREATED_BY_EMAIL_NAME);
    fields[indexOfCreatedBy] = modifiedFieldObject;
    fields = removeField(fields, CREATED_BY_EMAIL_NAME, 'DisplayName');
  }
  const indexOfModified = indexOfSchemaName(fields, MODIFIED_BY_DISPLAY_NAME, 'DisplayName');
  if (fields?.length && indexOfModified !== -1) {
    const modifiedFieldObject = getNewFieldObject(fields, indexOfModified, MODIFIED_BY_EMAIL_NAME);
    fields[indexOfModified] = modifiedFieldObject;
    fields = removeField(fields, MODIFIED_BY_EMAIL_NAME, 'DisplayName');
  }

  return fields;
};

export const augmentActivityDetails = (
  activityDetails: IActivityFields,
  renderNotes?: boolean
): IActivityFields[] => {
  let activityFields: IActivityFields[] = [];
  const currencyInfo = activityDetails?.ActivityEvent_Note?.split('{next}') || [];
  const currencyIndex = currencyInfo?.findIndex((item) => item.toLowerCase().includes('currency'));

  if (currencyIndex !== -1) {
    const currencySymbol = currencyInfo[currencyIndex].split('{=}')[1];
    activityFields = [
      {
        DisplayName: 'Currency',
        SchemaName: 'Currency',
        Value: currencySymbol,
        DataType: ActivityBaseAttributeDataType.String,
        ShowInForm: true,
        Fields: [],
        DisplayValue: 'Currency'
      },
      ...activityDetails.Fields
    ];
  } else {
    activityFields = activityDetails.Fields;
  }

  if (renderNotes) {
    const activityNotesIndex = activityFields.findIndex(
      (field) => field.SchemaName === ActivityBaseAttributeDataType.ActivityEventNote
    );
    if (activityNotesIndex < 0) {
      activityFields.unshift({
        DataType: ActivityBaseAttributeDataType.String,
        DisplayName: 'Notes',
        Fields: [],
        IsMasked: false,
        SchemaName: ActivityBaseAttributeDataType.ActivityEventNote,
        Value: activityDetails.ActivityEvent_Note || '',
        DisplayValue: '',
        ShowInForm: true
      });
    }
  }
  activityFields = augumentActivityFields(activityFields);
  return activityFields?.length ? handleUserFields(activityFields) : activityFields;
};

export const canRenderNotes = (activityEvent?: number): boolean => {
  if (
    activityEvent &&
    (activityEvent === ACTIVITY.PAYMENT ||
      activityEvent === activityType.LEAD_SHARE_HISTORY ||
      activityEvent >= 12000)
  ) {
    return true;
  }
  return false;
};
