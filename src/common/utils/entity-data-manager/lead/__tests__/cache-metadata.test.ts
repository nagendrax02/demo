import { setLeadMetaDataCache, getLeadMetaDataCache } from '../cache-metadata';
import { DataType, ILeadAttribute, ILeadMetadataMap, RenderType } from 'common/types/entity/lead';
import { ILeadMetaData } from 'common/types';
import * as storageUtils from 'common/utils/storage-manager';
import { createHashMapFromArray } from 'common/utils/helpers/helpers';
import { waitFor } from '@testing-library/react';

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

const testMetaDataPromise: Promise<ILeadMetaData> = new Promise((res) => {
  res(testMetaData);
});

const testMetadataMap: ILeadMetadataMap = createHashMapFromArray<ILeadAttribute>(
  testMetaData.Fields || [],
  'SchemaName'
);

describe('Lead Meta Data Cache', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Should store lead metadata in cache', () => {
    // Arrange
    const setItemSpy = jest.spyOn(storageUtils, 'setInDB');

    // Act
    setLeadMetaDataCache(testMetadataMap);

    // Assert
    waitFor(
      () => {
        expect(setItemSpy).toHaveBeenCalledWith(
          storageUtils.StorageKey.LDMetaData,
          testMetadataMap
        );
        setItemSpy.mockRestore();
      },
      { interval: 300 }
    );
  });

  it('Should handle error when storing lead metadata in cache', () => {
    // Arrange
    const error = new Error('setItem error');
    const setItemSpy = jest.spyOn(storageUtils, 'setInDB').mockImplementationOnce(() => {
      throw error;
    });

    // Act
    setLeadMetaDataCache(testMetadataMap);

    // Assert

    waitFor(
      () => {
        expect(console.error).toHaveBeenCalledWith(error);
        setItemSpy.mockRestore();
      },
      { interval: 300 }
    );
  });

  it('Should get lead metadata from cache', async () => {
    // Arrange
    const getItemSpy = jest
      .spyOn(storageUtils, 'getFromDB')
      .mockReturnValueOnce(testMetaDataPromise);

    // Act
    const result = await getLeadMetaDataCache();

    // Assert
    waitFor(
      () => {
        expect(result).toEqual(testMetaData);
        getItemSpy.mockRestore();
      },
      { interval: 300 }
    );
  });

  it('Should handle error when getting lead metadata from cache', async () => {
    // Arrange
    const error = new Error('getItem error');
    const getItemSpy = jest.spyOn(storageUtils, 'getFromDB').mockImplementationOnce(() => {
      throw error;
    });

    // Act
    await getLeadMetaDataCache();

    // Assert
    waitFor(
      () => {
        expect(console.error).toHaveBeenCalledWith(error);
        getItemSpy.mockRestore();
      },
      { interval: 300 }
    );
  });
});
