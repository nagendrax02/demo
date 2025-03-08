import { render } from '@testing-library/react';
import renderFields from './render-fields';
import Field from './Field';
import { IField } from '../opportunity-fields-renderer.types';

describe('renderFields component', () => {
  const fields: IField[] = [
    {
      DisplayName: 'Field1',
      Value: 'Value1',
      SchemaName: 'ParentSchemaName',
      DataType: 'ParentDataType',
      Fields: []
    },
    {
      DisplayName: 'Field2',
      Value: 'Value2',
      SchemaName: 'ParentSchemaName',
      DataType: 'ParentDataType',
      Fields: []
    }
  ];
  test('Should render no fields when fields array is empty', () => {
    // Act
    const { container } = render(renderFields([]));

    // Assert
    expect(container.querySelector('span')).toHaveTextContent('-');
  });

  test('Should render fields with values', () => {
    // Act
    const { getByText } = render(renderFields(fields));

    // Assert
    fields.forEach((field) => {
      expect(getByText(field.DisplayName)).toBeInTheDocument();
      expect(getByText(field.Value)).toBeInTheDocument();
    });
  });

  test('Should render fields with child fields', () => {
    // Arrange
    const updatedFields = [fields[0]];
    updatedFields[0].Fields = [
      {
        DisplayName: 'ChildField1',
        Value: 'ChildValue1',
        SchemaName: 'ChildSchemaName1',
        DataType: 'ChildDataType1',
        Fields: []
      },
      {
        DisplayName: 'ChildField2',
        Value: 'ChildValue2',
        SchemaName: 'ChildSchemaName2',
        DataType: 'ChildDataType',
        Fields: []
      }
    ];

    // Act
    const { getByText } = render(renderFields(updatedFields));

    // Assert
    expect(getByText('Field1')).toBeInTheDocument();
    expect(getByText('ChildField1')).toBeInTheDocument();
    expect(getByText('ChildValue1')).toBeInTheDocument();
    expect(getByText('ChildField2')).toBeInTheDocument();
    expect(getByText('ChildValue2')).toBeInTheDocument();
  });
});

describe('Field component', () => {
  test('Should render Field component', () => {
    // Act
    const { getByText } = render(<Field displayName="TestField" value="TestValue" key="1" />);

    // Assert
    expect(getByText('TestField')).toBeInTheDocument();
    expect(getByText('TestValue')).toBeInTheDocument();
  });

  test('Should render with renderValues', () => {
    // Arrange
    const renderValues = [<div key="2">RenderedValue1</div>, <div key="3">RenderedValue2</div>];

    // Act
    const { getByText, queryByText } = render(
      <Field displayName="TestField" value="TestValue" key="1" renderValues={renderValues} />
    );

    // Assert
    expect(getByText('RenderedValue1')).toBeInTheDocument();
    expect(getByText('RenderedValue2')).toBeInTheDocument();
  });
});
