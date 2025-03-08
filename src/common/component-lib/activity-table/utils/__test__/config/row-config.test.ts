import { handleFieldDataType, createFieldRow } from '../../config/row-config';
import * as constants from '../../../constants';

describe('Row-Config', () => {
  it('Should handle field data type when conditions are met', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      ShowInForm: true,
      IsMandatory: true,
      DataType: 'TestType',
      Value: '123',
      SchemaName: 'SchemaName'
    };
    const expected = handleFieldDataType(field, {
      ...field,
      DisplayName: field.DisplayName,
      IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD
    });

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return baseRow with Value as empty and isHeading as true when DataType is CUSTOM_OBJECT', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      DataType: constants.FIELD.CUSTOM_OBJECT,
      SchemaName: 'SchemaName',
      Value: 'Value',
      ShowInForm: true,
      IsMandatory: false
    };
    const expected = {
      ...field,
      DisplayName: field.DisplayName,
      IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD,
      Value: '',
      IsHeading: true
    };

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return baseRow with modified DisplayName, Value, isFile, and isHeading when DataType is CUSTOM_OBJECT_FILES', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      DataType: constants.FIELD.CUSTOM_OBJECT_FILES,
      SchemaName: 'SchemaName',
      Value: 'Value',
      ShowInForm: true,
      IsMandatory: false
    };
    const expected = {
      ...field,
      DisplayName: constants.DOWNLOAD_FILES,
      IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD,
      Value: '',
      IsFile: true,
      IsHeading: true
    };

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return baseRow with Value as NOT_UPLOADED when DataType is FILE', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      DataType: constants.FIELD.FILE,
      Value: constants.NOT_UPLOADED,
      SchemaName: 'SchemaName',
      ShowInForm: false,
      IsMandatory: false
    };
    const expected = {
      ...field,
      DisplayName: field.DisplayName,
      IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD
    };

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return baseRow with Value as field.Value when DataType is ACTIVE_USERS and field.Value is present', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      DataType: constants.FIELD.ACTIVE_USERS,
      Value: '123',
      SchemaName: 'SchemaName',
      ShowInForm: true,
      IsMandatory: false
    };
    const expected = {
      ...field,
      DisplayName: field.DisplayName,
      IsCFS: field.InternalName === constants.FIELD.CUSTOM_OBJECT_FIELD,
      Value: field.Value
    };

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return empty array as is when none of the conditions are met', () => {
    // Arrange
    const field = {
      DisplayName: 'Test',
      InternalName: 'Test',
      DataType: 'TestType',
      Value: '123',
      SchemaName: 'SchemaName',
      ShowInForm: false,
      IsMandatory: false
    };

    // Act
    const result = createFieldRow(field);

    // Assert
    expect(result).toEqual([]);
  });
});
