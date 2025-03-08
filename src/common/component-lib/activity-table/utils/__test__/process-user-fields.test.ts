import { processUserFields } from '../process-user-fields';
import * as constants from '../../constants';

const commonFields = {
  DataType: 'DataType',
  SchemaName: 'SchemaName',
  ShowInForm: true,
  IsMandatory: true
};

describe('ProcessUserFields', () => {
  it('Should return fields as is when none of the conditions are met', () => {
    // Arrange
    const fields = [
      {
        DisplayName: 'Test',
        Value: '123',
        ...commonFields
      }
    ];
    const expected = [...fields];

    // Act
    const result = processUserFields(fields);

    // Assert
    expect(result).toEqual(expected);
  });
});
