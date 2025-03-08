import { IField } from '../activity-table.types';
import * as constants from '../constants';

const indexOfSchemaName = (fields: IField[], schemaName: string, propertyName?: string): number => {
  return fields?.findIndex((currField) => {
    return propertyName
      ? currField[propertyName] === schemaName
      : currField?.SchemaName === schemaName;
  });
};

const removeField = (fields: IField[], propertyValue: string, propertyName: string): IField[] => {
  const indexOfEmailField = indexOfSchemaName(fields, propertyValue, propertyName);

  if (indexOfEmailField !== -1) {
    fields.splice(indexOfEmailField, 1);
  }
  return fields;
};

const getNewFieldObject = (fields: IField[], index: number, emailSchemaName: string): IField => {
  const oldField = fields[index] as IField;

  const emailField = fields?.filter((currField) => currField?.DisplayName === emailSchemaName)[0];
  if (oldField) {
    oldField.UserEmail = emailField?.Value || '';
  }
  return oldField;
};

const processField = (fields: IField[], schemaName: string, emailSchemaName: string): IField[] => {
  const index = indexOfSchemaName(fields, schemaName);
  if (fields?.length && index !== -1) {
    const modifiedFieldObject = getNewFieldObject(fields, index, emailSchemaName);
    fields[index] = modifiedFieldObject;
    fields = removeField(fields, emailSchemaName, constants.DISPLAYNAME);
  }
  return fields;
};

export const processUserFields = (fields: IField[]): IField[] => {
  fields = processField(
    fields,
    constants.SCHEMA_NAME.OWNER_SCHEMA_NAME,
    constants.SCHEMA_NAME.OWNER_EMAIL_DISPLAY_NAME
  );
  fields = processField(
    fields,
    constants.SCHEMA_NAME.CREATED_BY_DISPLAY_NAME,
    constants.SCHEMA_NAME.CREATED_BY_EMAIL_NAME
  );
  fields = processField(
    fields,
    constants.SCHEMA_NAME.MODIFIED_BY_DISPLAY_NAME,
    constants.SCHEMA_NAME.MODIFIED_BY_EMAIL_NAME
  );
  return fields;
};
