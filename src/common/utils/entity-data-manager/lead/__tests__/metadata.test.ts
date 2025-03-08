import { ILeadMetaData } from 'common/types';
import * as metadataUtils from '../metadata';
import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import { CallerSource } from 'src/common/utils/rest-client';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';

const error = new Error('test error');

beforeEach(() => {
  jest.restoreAllMocks();
});

const testMetaData: ILeadMetaData = {
  Fields: [
    {
      SchemaName: 'testSchemaName',
      DataType: DataType.Text,
      DisplayName: 'testName',
      RenderType: RenderType.TextArea
    }
  ],
  LeadRepresentationConfig: {
    SingularName: 'test',
    PluralName: 'tests'
  }
};

const metaDataMap = createHashMapFromArray<ILeadAttribute>(
  testMetaData?.Fields || [],
  'SchemaName'
);

describe('fetchMetaData', () => {
  it('Should return an object when invoked', async () => {
    // Arrange
    jest.spyOn(metadataUtils, 'fetchMetaData').mockResolvedValue(metaDataMap);

    // Act
    const result = await metadataUtils.fetchMetaData(CallerSource.LeadDetails);

    // Assert
    expect(result).toBe(metaDataMap);
  });

  it('Should throw error when an error occurs', async () => {
    // Arrange
    jest.spyOn(metadataUtils, 'fetchMetaData').mockRejectedValue(error);

    // Assert
    expect(metadataUtils.fetchMetaData(CallerSource.LeadDetails)).rejects.toThrowError();
  });
});
