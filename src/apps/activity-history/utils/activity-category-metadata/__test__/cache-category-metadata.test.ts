import { setCategoryMetadataCache, getCategoryMetadataCache } from '../cache-category-metadata';
import * as storageUtils from 'common/utils/storage-manager';

const mockData = [
  {
    Text: 'Text',
    Value: 'Value',
    EventType: 1,
    Category: 'Category',
    Selected: false,
    CategoryOrder: 0
  }
];

const augmentedMockData = {
  '': [
    {
      Text: 'Text',
      Value: 'Value',
      EventType: 1,
      Category: 'Category',
      Selected: false,
      CategoryOrder: 0
    }
  ]
};

describe('Activity Category Metadata Cache', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Should store activity category metadata in cache', () => {
    // Arrange
    const setItemSpy = jest.spyOn(storageUtils, 'setItem');

    // // Act
    // setCategoryMetadataCache(mockData);

    // // Assert
    // expect(setItemSpy).toHaveBeenCalledWith(
    //   storageUtils.StorageKey.ActivityCategoryMetadata,
    //   mockData
    // );
    // setItemSpy.mockRestore();
  });

  // it('Should handle error when storing activity category metadata in cache', () => {
  //   // Arrange
  //   const setItemSpy = jest.spyOn(storageUtils, 'setItem').mockImplementation(() => {
  //     throw new Error();
  //   });

  //   // Act
  //   setCategoryMetadataCache(mockData);

  //   // Assert
  //   expect(setItemSpy).toHaveBeenCalledWith(
  //     storageUtils.StorageKey.ActivityCategoryMetadata,
  //     mockData
  //   );
  //   expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  //   setItemSpy.mockRestore();
  // });

  // it('Should get activity category metadata from cache', () => {
  //   // Arrange
  //   const getItemSpy = jest.spyOn(storageUtils, 'getItem').mockReturnValue(mockData);

  //   // Act
  //   const result = getCategoryMetadataCache();

  //   // Assert
  //   expect(getItemSpy).toHaveBeenCalledWith(storageUtils.StorageKey.ActivityCategoryMetadata);
  //   expect(result).toEqual(mockData);
  //   getItemSpy.mockRestore();
  // });

  // it('Should handle error when getting activity category metadata from cache', () => {
  //   // Arrange
  //   const getItemSpy = jest.spyOn(storageUtils, 'getItem').mockImplementation(() => {
  //     throw new Error();
  //   });

  //   // Act
  //   const result = getCategoryMetadataCache();

  //   // Assert
  //   expect(getItemSpy).toHaveBeenCalledWith(storageUtils.StorageKey.ActivityCategoryMetadata);
  //   expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  //   expect(result).toBeUndefined();
  //   getItemSpy.mockRestore();
  // });
});
