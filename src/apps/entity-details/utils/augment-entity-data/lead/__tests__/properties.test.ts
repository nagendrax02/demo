import { DataType, ILead, RenderType } from 'common/types/entity/lead';
import { getAugmentedLeadProperty } from '../properties';

//Arrange
const dummyEntityData: ILead = {
  details: {
    Fields: {},
    VCardConfiguration: { DisplayName: '', Sections: [] },
    ActionsConfiguration: [],
    TabsConfiguration: [],
    LeadDetailsConfiguration: {
      Sections: []
    },
    ConnectorConfiguration: {}
  },
  metaData: {}
};

//Arrange
const entityData: ILead = {
  details: {
    Fields: {
      DoNotEmail: '1',
      mx_Alto73_Integer_Field: null
    },
    VCardConfiguration: {
      DisplayName: '',
      Sections: [
        {
          Name: 'Lead Properties',
          DisplayName: 'Lead Properties',
          CanModify: true,
          Fields: [
            {
              DisplayName: 'Do Not Email Test',
              SchemaName: 'DoNotEmail',
              ColSpan: '2',
              Fields: []
            },
            {
              DisplayName: 'Alto73 Integer Field<span style="color:red;margin-left:2px;">*</span>',
              SchemaName: 'mx_Alto73_Integer_Field',
              ColSpan: '2',
              Fields: []
            }
          ]
        }
      ]
    },
    ActionsConfiguration: [],
    TabsConfiguration: [],
    LeadDetailsConfiguration: {
      Sections: []
    },
    ConnectorConfiguration: {}
  },
  metaData: {
    Fields: [
      {
        DataType: 'Boolean' as DataType,
        IsDisabled: false,
        IsLeadIdentifier: false,
        IsUnique: false,
        IsSortable: true,
        Precision: 0,
        Scale: 0,
        ParentField: '',
        RenderType: 'Checkbox' as RenderType,
        SchemaName: 'DoNotEmail',
        DisplayName: 'Do Not Email Test',
        CustomObjectMetaData: {
          Fields: [],
          FileStorageVersion: 0
        }
      },
      {
        DataType: 'Number' as DataType,
        IsDisabled: false,
        IsLeadIdentifier: false,
        IsUnique: false,
        IsSortable: true,
        Precision: 0,
        Scale: 0,
        ParentField: '',
        RenderType: 'Textbox' as RenderType,
        SchemaName: 'mx_Alto73_Integer_Field',
        DisplayName: 'Alto73 Integer Field',
        CustomObjectMetaData: {
          Fields: [],
          FileStorageVersion: 0
        }
      }
    ]
  }
};

//Arrange
const augmentedData = {
  entityProperty: [
    {
      id: 'DoNotEmail',
      name: 'Do Not Email Test',
      schemaName: 'DoNotEmail',
      value: '1',
      fieldRenderType: 'Checkbox',
      dataType: 'Boolean',
      entityAttributeType: undefined
    },
    {
      id: 'mx_Alto73_Integer_Field',
      name: 'Alto73 Integer Field',
      schemaName: 'mx_Alto73_Integer_Field',
      value: '',
      fieldRenderType: 'Textbox',
      dataType: 'Number',
      entityAttributeType: undefined
    }
  ],
  fields: {
    DoNotEmail: '1',
    mx_Alto73_Integer_Field: null
  },
  entityConfig: {},
  featureRestrictionConfig: {
    actionName: 'Edit Lead',
    callerSource: 'LeadDetailsVCard',
    moduleName: 'LeadDetails'
  }
};

describe('getAugmentedLeadProperty', () => {
  it('Should return an empty object when response from API does not contain metadata, details', () => {
    //Act
    const result = getAugmentedLeadProperty(dummyEntityData);

    //Assert
    expect(result).toEqual({
      entityProperty: [],
      fields: {},
      entityConfig: {},
      featureRestrictionConfig: {
        actionName: 'Edit Lead',
        callerSource: 'LeadDetailsVCard',
        moduleName: 'LeadDetails'
      }
    });
  });

  it('Should return augmented Property when valid entityData is provided', () => {
    //Act
    const result = getAugmentedLeadProperty(entityData);

    //Assert
    expect(result).toEqual(augmentedData);
  });
});
