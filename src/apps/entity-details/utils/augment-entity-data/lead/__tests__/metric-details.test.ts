import { IEntity } from 'common/types';
import { DataType, RenderType } from 'common/types/entity/lead';
import { getAugmentedMetricDetails } from '../metric-details';

//Arrange
const entityData: IEntity = {
  details: {
    Fields: {
      Account_Country: 'Austria',
      Account_Fax: '',
      mx_Alto28_Decimal3_Field: null
    },
    VCardConfiguration: {
      DisplayName: '',
      Sections: [
        {
          Name: 'Metric',
          DisplayName: 'Metric Section',
          CanModify: true,
          Fields: [
            {
              DisplayName: 'Alto28 Decimal3 Field<span style="color:red;margin-left:2px;">*</span>',
              SchemaName: 'mx_Alto28_Decimal3_Field',
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
        DataType: 'Text' as DataType,
        IsDisabled: false,
        IsLeadIdentifier: true,
        IsUnique: false,
        IsSortable: true,
        Precision: 0,
        Scale: 0,
        ParentField: '',
        RenderType: 'Textbox' as RenderType,
        SchemaName: 'FirstName',
        DisplayName: 'First Name_Primeiro nome',
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
        Scale: 3,
        ParentField: '',
        RenderType: 'Textbox' as RenderType,
        SchemaName: 'mx_Alto28_Decimal3_Field',
        DisplayName: 'Alto28 Decimal3 Field',
        CustomObjectMetaData: {
          Fields: [],
          FileStorageVersion: 0
        }
      }
    ]
  }
};

//Arrange
const dummyEntityData: IEntity = {
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

describe('getAugmentedMetricDetails', () => {
  it('Should returns an empty array when "First Name" schema name is not present in metadata', () => {
    //Act
    const result = getAugmentedMetricDetails(dummyEntityData);

    //Assert
    expect(result).toEqual([]);
  });

  it('Should return augmented metric data when data is provided', () => {
    //Act
    const result = getAugmentedMetricDetails(entityData);

    //Assert
    expect(result).toEqual([
      {
        id: 'mx_Alto28_Decimal3_Field',
        name: 'Alto28 Decimal3 Field',
        value: ''
      }
    ]);
  });
});
