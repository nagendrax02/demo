import { ILeadDetails } from 'common/types';
import { setLeadDetailsCache, getLeadDetailsCache } from '../cache-details';
import * as storageUtils from 'common/utils/storage-manager';

const testLeadDetails: ILeadDetails = {
  Fields: { testProperty: 'testValue' },
  ActionsConfiguration: [],
  TabsConfiguration: [],
  VCardConfiguration: {
    DisplayName: 'testVCard',
    Sections: []
  },
  ConnectorConfiguration: {},
  LeadDetailsConfiguration: {
    Sections: []
  }
};

const mockCachedLeadDetails = {
  ActionsConfiguration: [],
  TabsConfiguration: [],
  VCardConfiguration: {
    DisplayName: 'testVCard',
    Sections: []
  },
  ConnectorConfiguration: {},
  LeadDetailsConfiguration: {
    Sections: []
  }
};

describe('Lead Details Cache', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Should store lead details in cache', () => {
    // Arrange
    const setItemSpy = jest.spyOn(storageUtils, 'setItem');

    // Act
    setLeadDetailsCache(testLeadDetails);

    // Assert
    expect(setItemSpy).toHaveBeenCalledWith(
      storageUtils.StorageKey.LDCompoundData,
      mockCachedLeadDetails
    );
    setItemSpy.mockRestore();
  });

  it('Should handle error when storing lead details in cache', () => {
    // Arrange
    const setItemSpy = jest.spyOn(storageUtils, 'setItem').mockImplementation(() => {
      throw new Error();
    });

    // Act
    setLeadDetailsCache(testLeadDetails);

    // Assert
    expect(setItemSpy).toHaveBeenCalledWith(
      storageUtils.StorageKey.LDCompoundData,
      mockCachedLeadDetails
    );
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    setItemSpy.mockRestore();
  });

  it('Should get lead details from cache', () => {
    // Arrange
    const getItemSpy = jest.spyOn(storageUtils, 'getItem').mockReturnValue(mockCachedLeadDetails);

    // Act
    const result = getLeadDetailsCache();

    // Assert
    expect(getItemSpy).toHaveBeenCalledWith(storageUtils.StorageKey.LDCompoundData);
    expect(result).toEqual(mockCachedLeadDetails);
    getItemSpy.mockRestore();
  });

  it('Should handle error when getting lead details from cache', () => {
    // Arrange
    const getItemSpy = jest.spyOn(storageUtils, 'getItem').mockImplementation(() => {
      throw new Error();
    });

    // Act
    const result = getLeadDetailsCache();

    // Assert
    expect(getItemSpy).toHaveBeenCalledWith(storageUtils.StorageKey.LDCompoundData);
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
    getItemSpy.mockRestore();
  });
});
