import { ILeadMetaData } from 'common/types';
import { getAugmentedAttributes } from './attributes';
import { ILeadDetailsConfiguration } from 'common/types/entity/lead';

const mockLeadDetailsConfiguration = {
  Sections: [
    {
      Name: 'LeadDetailsCustomtest',
      DisplayName: 'Lead Details Custom test',
      DispositionField: '',
      CanModify: true,
      Fields: [
        {
          SchemaName: 'Mobile',
          DisplayName: 'Mobile Number<span style="color:red;margin-left:2px;">*</span>',
          ColSpan: '2',
          Fields: []
        },
        {
          SchemaName: 'mx_Glanza_CFS_only_Lead',
          DisplayName: 'Glanza CFS only Lead',
          ColSpan: '2',
          Fields: [
            {
              SchemaName: 'Status',
              DisplayName: 'Status',
              ColSpan: '1',
              Fields: []
            },
            {
              SchemaName: 'mx_CustomObject_1',
              DisplayName: 'GLOL string1',
              ColSpan: '1',
              Fields: []
            }
          ]
        }
      ]
    }
  ]
};

const mockFields = {
  Mobile: 'hello',
  mx_Glanza_CFS_only_Lead: '{"Status":"Pending","mx_CustomObject_1":"Hello"}'
};

const mockMetadata = {
  Fields: [
    {
      DataType: 'Phone',
      IsDisabled: false,
      IsLeadIdentifier: true,
      IsUnique: false,
      IsSortable: true,
      LOSProperties: null,
      Precision: 0,
      Scale: 0,
      ParentField: '',
      RenderType: 'Textbox',
      SchemaName: 'Mobile',
      DisplayName: 'Mobile Number',
      CustomObjectMetaData: {
        Fields: [],
        FileStorageVersion: 0
      },
      IsReadOnly: false,
      IsVisible: true,
      MandateComments: null,
      LockAfterCreate: 0,
      EntityAttributeType: 'System',
      DefaultValue: '',
      IsMandatory: true,
      RestrictionType: null,
      ShowInImport: true,
      RangeMax: '50',
      RangeMin: '0',
      AllowAutoUpdateToOptions: false,
      FirstOptionValue: null,
      IsSearchable: true,
      UniqueFieldConfiguration: null
    },
    {
      DataType: 'CustomObject',
      IsDisabled: false,
      IsLeadIdentifier: false,
      IsUnique: false,
      IsSortable: true,
      LOSProperties: null,
      Precision: 0,
      Scale: 0,
      ParentField: '',
      RenderType: 'None',
      SchemaName: 'mx_Glanza_CFS_only_Lead',
      DisplayName: 'Glanza CFS only Lead',
      CustomObjectMetaData: {
        Fields: [
          {
            CustomObjectSchemaName: 'mx_Glanza_CFS_only_Lead',
            SchemaName: 'Status',
            DisplayName: 'Status',
            DataType: 'SearchableDropdown',
            ParentField: '',
            RenderType: null,
            IsMultiSelectDropdown: false,
            IsMandatory: false,
            StringRenderType: null,
            LOSProperties: null,
            MaxLength: 200,
            InternalSchemaName: null,
            FileContentProperties: null,
            ShowInForm: false,
            FirstOptionValue: 'Pending',
            OptionSet: null
          },
          {
            CustomObjectSchemaName: 'mx_Glanza_CFS_only_Lead',
            SchemaName: 'mx_CustomObject_1',
            DisplayName: 'GLOL string1',
            DataType: 'String',
            ParentField: '',
            RenderType: null,
            IsMultiSelectDropdown: false,
            IsMandatory: false,
            StringRenderType: null,
            LOSProperties: null,
            MaxLength: 200,
            InternalSchemaName: null,
            FileContentProperties: null,
            ShowInForm: false,
            FirstOptionValue: null,
            OptionSet: null
          }
        ],
        FileStorageVersion: -1
      },
      IsReadOnly: false,
      IsVisible: true,
      MandateComments: null,
      LockAfterCreate: 0,
      EntityAttributeType: 'Custom',
      DefaultValue: '',
      IsMandatory: false,
      RestrictionType: null,
      ShowInImport: true,
      RangeMax: '50',
      RangeMin: null,
      AllowAutoUpdateToOptions: false,
      FirstOptionValue: null,
      IsSearchable: true,
      UniqueFieldConfiguration: null
    }
  ]
};

describe('Attributes', () => {
  it('Should return augmented attributes config', () => {
    // Act
    const result = getAugmentedAttributes({
      attributes: mockLeadDetailsConfiguration,
      fields: mockFields,
      metaData: mockMetadata as unknown as ILeadMetaData
    });

    // Assert
    expect(result[0]?.id).toBe('LeadDetailsCustomtest');
  });

  it('Should return empty array when lead details configuration is empty or metadata is empty', () => {
    // Act
    const result = getAugmentedAttributes({
      attributes: [] as unknown as ILeadDetailsConfiguration,
      fields: mockFields,
      metaData: [] as unknown as ILeadMetaData
    });

    // Assert
    expect([]).toEqual([]);
  });
});
