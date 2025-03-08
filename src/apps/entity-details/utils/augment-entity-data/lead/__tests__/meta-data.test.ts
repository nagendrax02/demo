import { DataType, RenderType } from 'common/types/entity/lead';
import { getAugmentedMetaData } from '../meta-data';

//Arrange
const leadMetaData = [
  {
    DataType: 'Date' as DataType,
    IsDisabled: false,
    IsLeadIdentifier: false,
    IsUnique: false,
    IsSortable: true,
    Precision: 0,
    Scale: 0,
    ParentField: '',
    RenderType: 'Date' as RenderType,
    SchemaName: 'mx_Honda99_Date_Field',
    DisplayName: 'Honda99 Date Field',
    CustomObjectMetaData: {
      Fields: [],
      FileStorageVersion: 0
    },
    IsReadOnly: false,
    IsVisible: true,
    UniqueFieldConfiguration: null
  }
];

describe('getAugmentedMetaData', () => {
  it('Should return an empty object when undefined is passed', () => {
    //Act
    const result = getAugmentedMetaData(undefined);

    //Assert
    expect(result).toEqual({});
  });

  it('Should return augmented metadata when valid metadata is provided', () => {
    //Act
    const result = getAugmentedMetaData(leadMetaData);

    //Assert
    expect(result).toEqual({
      mx_Honda99_Date_Field: {
        RenderType: 'Date',
        DataType: 'Date',
        DisplayName: 'Honda99 Date Field'
      }
    });
  });
});
