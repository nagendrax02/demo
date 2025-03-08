import { render, screen } from '@testing-library/react';
import Field from './Field';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';

const data = {
  id: 'mx_Alto28_Decimal3_Field',
  schemaName: 'mx_Alto28_Decimal3_Field',
  name: 'Alto28 Decimal3 Field<span style="color:red;margin-left:2px;">*</span>',
  value: '50000.000',
  fieldRenderType: 'Textbox',
  dataType: 'Number',
  colSpan: 2,
  cfsFields: []
};
const cfsData = {
  id: 'mx_Glanza_CFS_only_Lead',
  schemaName: 'mx_Glanza_CFS_only_Lead',
  name: 'Glanza CFS only Lead',
  value:
    '{"Status":"Approved","mx_CustomObject_1":"sdfdsfsdf","mx_CustomObject_2":"sdfdsfdsfsdf","mx_CustomObject_3":"sdfdsfdsfsdf","mx_CustomObject_4":"323324234","mx_CustomObject_5":"5","mx_CustomObject_6":"4","mx_CustomObject_7":"2023-12-05 18:32:00","mx_CustomObject_8":"2023-12-13 18:33:00","mx_CustomObject_9":"2023-12-05 18:33:00","mx_CustomObject_10":"2023-12-23 00:00:00","mx_CustomObject_11":"2023-12-21 00:00:00","mx_CustomObject_12":"2023-12-15 00:00:00","mx_CustomObject_13":"sdfdsfdsf","mx_CustomObject_14":"","mx_CustomObject_15":"","mx_CustomObject_16":"","mx_CustomObject_17":"","mx_CustomObject_18":"","mx_CustomObject_19":"test4","mx_CustomObject_20":"test4","mx_CustomObject_21":"test4","mx_CustomObject_22":"test3","mx_CustomObject_23":"15aa0d98-c3c7-11ed-8c6d-02930afc2f3c","mx_CustomObject_24":"Mangalore"}',
  fieldRenderType: 'None',
  dataType: 'CustomObject',
  colSpan: 2,
  cfsFields: [
    {
      id: 'Status',
      name: 'Status',
      schemaName: 'Status',
      value: 'Approved',
      fieldRenderType: '',
      dataType: 'SearchableDropdown',
      colSpan: 1
    },
    {
      id: 'mx_CustomObject_1',
      name: 'GLOL string1',
      schemaName: 'mx_CustomObject_1',
      value: 'sdfdsfsdf',
      fieldRenderType: '',
      dataType: 'String',
      colSpan: 1
    }
  ]
};

describe('Entity Attribute Field', () => {
  test('Should render fields', () => {
    //Arrange
    render(<Field data={data as IAugmentedAttributeFields} />);

    //Assert
    expect(screen.getByText('Alto28 Decimal3 Field')).toBeInTheDocument();
  });

  test('Should render cfs fields', () => {
    //Arrange
    render(<Field data={cfsData as IAugmentedAttributeFields} />);

    //Assert
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
