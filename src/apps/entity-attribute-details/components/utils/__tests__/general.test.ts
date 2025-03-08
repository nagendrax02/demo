import { IAugmentedAttributes } from 'apps/entity-details/types/entity-data.types';
import { cleanName, getFilteredAttributes, highlightFields } from '../general';

const attributes = [
  {
    id: 'Section2test',
    name: 'Section 2 test',
    fields: [
      {
        id: 'mx_PAN_Number',
        schemaName: 'mx_PAN_Number',
        name: 'PAN Number',
        value: 'hello',
        fieldRenderType: 'Textbox',
        dataType: 'Text',
        colSpan: 2,
        cfsFields: [],
        isMatched: false
      },
      {
        id: 'mx_Ciaz94_Phone_Field',
        schemaName: 'mx_Ciaz94_Phone_Field',
        name: 'Ciaz94 Phone Field',
        value: '',
        fieldRenderType: 'Phone',
        dataType: 'Phone',
        colSpan: 2,
        cfsFields: [],
        isMatched: false
      }
    ]
  }
];

describe('Entity Attribute details Utils', () => {
  test('Should remove html content from field name', () => {
    expect(cleanName('Mobile Number<span style="color:red;margin-left:2px;">*</span>')).toBe(
      'Mobile Number'
    );
  });

  test('Should filter empty value attribute fields', () => {
    //Arrange
    const filteredAttributes = getFilteredAttributes(attributes as IAugmentedAttributes[]);

    //Assert
    expect(filteredAttributes[0].fields?.length).toBe(1);
  });

  test('Should return empty attribute when input is empty', () => {
    //Arrange
    const filteredAttributes = getFilteredAttributes([] as IAugmentedAttributes[]);

    //Assert
    expect(filteredAttributes?.length).toBe(0);
  });

  test('Should update isMatched to true when search value matches field value or name', () => {
    //Arrange
    const highlightedAttributes = highlightFields(attributes as IAugmentedAttributes[], 'hello');
    //@ts-ignore //added due to data
    const isMatched = highlightedAttributes?.attributes[0]?.fields[0]?.isMatched;

    //Assert
    expect(isMatched).toBe(true);
  });
});
