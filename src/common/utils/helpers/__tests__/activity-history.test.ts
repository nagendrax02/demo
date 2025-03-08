import { noteParser, customActivityParser, convertSecondsToMinute } from '../activity-history';

describe('noteParser function', () => {
  it('Should parse the string into a key-value object', () => {
    // Arrange
    const str = '{keyvalueinfo}{key1{=}value1{next}key2{=}value2';
    const expected = {
      key1: 'value1',
      key2: 'value2'
    };

    // Act
    const result = noteParser(str);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should ignore items without a key', () => {
    // Arrange
    const str = '{keyvalueinfo}{key1{=}value1{next}{=}value2';
    const expected = {
      key1: 'value1'
    };

    // Act
    const result = noteParser(str);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return null when the string is null', () => {
    // Arrange
    const str = '';

    // Act
    const result = noteParser(str);

    // Assert
    expect(result).toBeNull();
  });
});

describe('convertSecondsToMinute', () => {
  it('Should convert 120 seconds to 2 minutes', () => {
    // Arrange
    const seconds = 120;
    const expected = '2 minutes';

    // Act
    const result = convertSecondsToMinute(seconds);

    // Assert
    expect(result).toEqual(expected);
  });
});

describe('customActivityParser', () => {
  it('Should parse the string into a key-value object', () => {
    // Arrange
    const str = 'key1{=}value1{next}key2{=}value2';
    const expected = {
      key1: 'value1',
      key2: 'value2'
    };

    // Act
    const result = customActivityParser(str);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should ignore items without a key', () => {
    // Arrange
    const str = 'key1{=}value1{next}{=}value2';
    const expected = {
      key1: 'value1'
    };

    // Act
    const result = customActivityParser(str);

    // Assert
    expect(result).toEqual(expected);
  });

  it('Should return null when the string is null', () => {
    // Arrange
    const str = '';

    // Act
    const result = customActivityParser(str);

    // Assert
    expect(result).toBeNull();
  });
});
