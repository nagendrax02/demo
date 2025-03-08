import { RenderType, DataType } from 'common/types/entity/lead/metadata.types';
import * as Utils from '../utils';
import { VIEW_FILES, NO_NAME, COLUMN_KEY, AUDIO_PLAYER } from '../../constants';

const mockRowData = {
  SchemaName: 'testSchemaName',
  DisplayName: 'testDisplayName',
  resourceUrl: 'testUrl',
  Value: 'testValue',
  DisplayValue: 'testDisplayValue',
  isActivity: true
};

const mockProperty = {
  id: 'testSchemaName',
  name: 'testDisplayName',
  schemaName: 'testSchemaName',
  fieldRenderType: RenderType.Audio,
  dataType: DataType.Audio,
  value: 'testValue'
};

describe('getFileList', () => {
  it('Should return an empty array when fieldsData is undefined', () => {
    // Act
    const result = Utils.getFileFields(undefined, null);

    // Assert
    expect(result).toEqual([]);
  });

  it('Should return an empty array when fieldsData is empty', () => {
    // Act
    const result = Utils.getFileFields([], null);

    // Assert
    expect(result).toEqual([]);
  });

  it('Should return an array of fileFields when fieldsData contains valid data', () => {
    // Arrange
    const fieldsData = [
      {
        IsFile: true,
        SchemaName: 'testSchema',
        CustomObjectSchemaName: 'testCustomObjectSchema',
        DisplayName: 'textDisplayName',
        Value: 'testValue'
      },
      {
        IsFile: false,
        SchemaName: 'testSchema2',
        CustomObjectSchemaName: 'testCustomObjectSchema2',
        DisplayName: 'textDisplayName2',
        Value: 'testValue2'
      }
    ];

    // Act
    const result = Utils.getFileFields(fieldsData, null);

    // Assert
    expect(result?.[0]?.CustomObjectSchemaName).toEqual('testCustomObjectSchema');
  });
});

describe('getCustomObjectLeadProperty', () => {
  it('Should return value as NO_NAME when rowData is undefined', () => {
    // Act
    const result = Utils.getCustomObjectLeadProperty({}, 'testColumnKey');

    // Assert
    expect(result.name).toEqual(NO_NAME);
  });

  it('Should return value as OldDisplayValue when columnKey is COLUMN_KEY.OLD_VALUE', () => {
    // Arrange
    const rowData = {
      OldDisplayValue: 'testOldDisplayValue',
      NewDisplayValue: 'testNewDisplayValue'
    };

    // Act
    const result = Utils.getCustomObjectLeadProperty(rowData, COLUMN_KEY.OLD_VALUE);

    // Assert
    expect(result.name).toEqual('testOldDisplayValue');
  });

  it('Should return value NewDisplayValue when columnKey is not COLUMN_KEY.OLD_VALUE', () => {
    // Arrange
    const rowData = {
      OldDisplayValue: 'testOldDisplayValue',
      NewDisplayValue: 'testNewDisplayValue'
    };

    // Act
    const result = Utils.getCustomObjectLeadProperty(rowData, 'testColumnKey');

    // Assert
    expect(result.name).toEqual('No Name');
  });
});

describe('getAudioProperty', () => {
  it('Should return audio property ', () => {
    mockProperty.fieldRenderType = RenderType.Audio;
    mockProperty.dataType = DataType.Audio;
    mockProperty.value = 'testUrl';

    // Act
    const result = Utils.getAudioProperty(mockRowData);

    // Assert
    expect(result?.dataType).toEqual('Audio');
  });
});

describe('getFileProperty', () => {
  it('Should return file property ', () => {
    mockRowData.Value = 'testUrl';
    mockProperty.fieldRenderType = RenderType.File;
    mockProperty.dataType = DataType.File;
    mockProperty.value = 'testUrl';

    // Act
    const result = Utils.getFileProperty(mockRowData);

    // Assert
    expect(result?.dataType).toEqual('File');
  });
});

describe('getUrlProperty', () => {
  it('Should return Url property ', () => {
    mockRowData.Value = 'testValue';
    mockProperty.fieldRenderType = RenderType.URL;
    mockProperty.dataType = DataType.Url;
    mockProperty.value = 'testValue';

    // Act
    const result = Utils.getUrlProperty(mockRowData);

    // Assert
    expect(result?.dataType).toEqual('Url');
  });
});

describe('getLeadProperty', () => {
  it('Should return lead property ', () => {
    const mockResult = {
      ...mockProperty,
      fieldRenderType: RenderType.Lead,
      dataType: DataType.Lead,
      value: 'testValue',
      name: 'testDisplayValue'
    };

    // Act
    const result = Utils.getLeadProperty(mockRowData);

    // Assert
    expect(result?.dataType).toEqual('Lead');
  });
});

describe('getUserNameProperty', () => {
  it('Should return username property ', () => {
    mockRowData.Value = 'testValue';
    mockProperty.fieldRenderType = RenderType.UserName;
    mockProperty.dataType = DataType.ActiveUsers;
    mockProperty.value = 'testValue';

    // Act
    const result = Utils.getUserNameProperty(mockRowData);

    // Assert
    expect(result?.dataType).toEqual('ActiveUsers');
  });
});

describe('getEntityProperty', () => {
  beforeEach(() => {
    jest.spyOn(Utils, 'getUserNameProperty');
    jest.spyOn(Utils, 'getLeadProperty');
    jest.spyOn(Utils, 'getUrlProperty');
    jest.spyOn(Utils, 'getCustomObjectLeadProperty');
    jest.spyOn(Utils, 'getFileProperty');
    jest.spyOn(Utils, 'getAudioProperty');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const rowData = {
    SchemaName: 'testSchemaName',
    DataType: 'testDataType',
    IsFile: true,
    FilesCSV: 'xxxxx',
    Value: '',
    resourceUrl: 'testUrl',
    activityId: 'testActivityId',
    activityEventCode: 'testActivityEventCode',
    isOpportunity: true
  };
  const columnKey = 'Value';

  it('Should return user property when DataType is ActiveUsers', () => {
    // Arrange
    rowData.IsFile = false;
    rowData.SchemaName = 'ModifiedBy';
    rowData.DataType = DataType.ActiveUsers;

    // Act
    Utils.getEntityProperty({ columnKey, rowData });

    // Assert
    expect(Utils.getUserNameProperty).toHaveBeenCalledWith(rowData);
  });

  it('Should return lead property when DataType is Lead', () => {
    // Arrange
    rowData.SchemaName = '';
    rowData.DataType = DataType.Lead;
    // Act
    Utils.getEntityProperty({ columnKey, rowData });

    // Assert
    expect(Utils.getLeadProperty).toHaveBeenCalledWith(rowData);
  });

  it('Should return url property when SchemaName is Opportunity', () => {
    // Arrange
    rowData.SchemaName = 'mx_Custom_1';
    rowData.activityId = 'testActivityId';
    rowData.activityEventCode = 'testActivityEventCode';
    rowData.isOpportunity = true;
    rowData.DataType = '';

    // Act
    Utils.getEntityProperty({ columnKey, rowData });

    // Assert
    expect(Utils.getUrlProperty).toHaveBeenCalledWith(rowData);
  });

  it('Should return file property when IsFile is true and Value is VIEW_FILES', () => {
    // Arrange
    rowData.IsFile = true;
    rowData.FilesCSV = '';
    rowData.SchemaName = '';
    rowData.Value = VIEW_FILES;

    // Act
    Utils.getEntityProperty({ columnKey, rowData });

    // Assert
    expect(Utils.getFileProperty).toHaveBeenCalledWith(rowData, undefined);
  });

  it('Should return audio property when IsFile is true and Value is AUDIO_PLAYER', () => {
    // Arrange
    rowData.Value = AUDIO_PLAYER;

    // Act
    Utils.getEntityProperty({ columnKey, rowData });

    // Assert
    expect(Utils.getAudioProperty).toHaveBeenCalledWith(rowData);
  });
});
