import { ENV_CONFIG, ERROR_MSG } from 'common/constants';
import { classNames, getEnvConfig, safeParseJson } from '../helpers';

describe('Helpers', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should convert a string into json object when valid input is provided', () => {
    // Arrange
    const jsonData = '{"example":"json data"}';

    //Act
    const data = safeParseJson(jsonData);

    //Assert
    expect(data).toStrictEqual({ example: 'json data' });
  });

  it('Should return null when corrupted json provided.', () => {
    // Arrange
    const jsonData = 'corruptedJSON';

    //Act
    const data = safeParseJson(jsonData);

    //Assert
    expect(data).toBeNull();
  });

  it('Should return null when given value is empty.', () => {
    // Arrange
    const jsonData = '';

    //Act
    const data = safeParseJson(jsonData);

    //Assert
    expect(data).toBeNull();
  });

  it('Should return an empty string when no arguments are provided', () => {
    // Act
    const result = classNames();

    // Assert
    expect(result).toBe('');
  });

  it('Should return a single class name when one valid class name is provided', () => {
    // Act
    const result = classNames('class1');

    // Assert
    expect(result).toBe('class1');
  });

  it('Should return a space-separated string of class names when multiple valid class names are provided', () => {
    // Act
    const result = classNames('class1', 'class2', 'class3');

    // Assert
    expect(result).toBe('class1 class2 class3');
  });

  it('Should ignore non-string arguments and return only valid class names', () => {
    // Act
    const result = classNames('class1', null, 'class2', undefined, 'class3');

    // Assert
    expect(result).toBe('class1 class2 class3');
  });

  it('Should return an empty string when all arguments are non-string values', () => {
    // Act
    const result = classNames(null, undefined);

    // Assert
    expect(result).toBe('');
  });
});

describe('GetEnvConfig', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('Should return the environment configuration when available', () => {
    //Arrange
    const configValue = 'config';
    const key = 'key';
    const mockEnv = { [key]: configValue };
    global.self[ENV_CONFIG.envKey] = mockEnv;

    //Act
    const result = getEnvConfig(key);

    //Assert
    expect(result).toBe(configValue);
  });
});
