import { setItem, getItem, removeItem, clearStorage } from '..';
import { StorageKey } from '../storage.types';
import * as storage from '../storage';
import * as helpers from '../../helpers';

describe('StorageManager', () => {
  let getItemSpy;
  let setItemSpy;
  let clearSpy;
  let removeItemSpy;
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {});
    setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {});
    clearSpy = jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(() => {});
    removeItemSpy = jest
      .spyOn(window.localStorage.__proto__, 'removeItem')
      .mockImplementation(() => {});
    windowSpy = jest.spyOn(globalThis, 'window', 'get');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(helpers, 'isMiP').mockImplementation(() => false);
  });

  afterEach(() => {
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    clearSpy.mockRestore();
    removeItemSpy.mockRestore();
    windowSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('Should set data in storage when key and values are provided.', () => {
    //Arrange
    const key = 'testKey1';
    const value = { example: 'json data' };
    setItemSpy.mockReturnValue(true);

    //Act
    const result = setItem(key as StorageKey, value);

    //Assert
    expect(setItemSpy).toHaveBeenCalledWith(key, JSON.stringify(value));
    expect(result).toBe(true);
  });

  it('Should handle the exception when data is set to storage.', () => {
    //Arrange
    const key = 'testKey3';
    const value = 'data';
    setItemSpy.mockImplementation(() => {
      throw new Error();
    });

    //Act
    setItem(key as StorageKey, value);

    //Assert
    expect(setItemSpy).toThrow(Error);
  });

  it('Should get data from storage when key is provided.', () => {
    //Arrange
    const key = 'testKey4';
    const value = { example: 'data' };
    getItemSpy.mockReturnValue(JSON.stringify(value));

    //Act
    const result = getItem(key as StorageKey);

    //Assert
    expect(getItemSpy).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('Should return stored data without json parse when data is not parsable.', () => {
    //Arrange
    const key = 'testKey5';
    const value = 'hello';
    getItemSpy.mockReturnValue(value);

    //Act
    const result = getItem(key as StorageKey);

    //Assert
    expect(getItemSpy).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('Should not empty string when key is not present in storage.', () => {
    //Arrange
    const key = 'testKey6';
    getItemSpy.mockReturnValue({});

    //Act
    const result = getItem(key as StorageKey);

    //Assert
    expect(getItemSpy).toHaveBeenCalledWith(key);
    expect(result).toStrictEqual({});
  });

  it('Should clear all the data from storage.', () => {
    //Act
    clearStorage();

    //Assert
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('Should remove the key value pair from storage when key is provided.', () => {
    //Arrange
    const key = 'testKey7';

    //Act
    removeItem(key as StorageKey);

    //Assert
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
  });

  it('Should handle the exception while getting data from storage when any Error occurs.', () => {
    //Arrange
    const key = 'testKey9';
    getItemSpy.mockImplementation(() => {
      throw new Error();
    });

    //Act
    getItem(key as StorageKey);

    //Assert
    expect(getItemSpy).toThrow(Error);
  });
});
