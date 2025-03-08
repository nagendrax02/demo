import { stringifyError } from '../logger-utils';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('StringifyError', () => {
  it('Should stringify an Error object', () => {
    //Arrange
    const mockError = {
      name: 'error name',
      cause: 'error cause',
      stack: 'error stack',
      message: 'error message'
    };
    jest.spyOn(global, 'Error').mockReturnValue(mockError);
    const errorObject = new Error();

    //Act
    const result = stringifyError('key', errorObject);

    //Assert
    expect(result).toHaveProperty('message', mockError.message);
    expect(result).toHaveProperty('name', mockError.name);
    expect(result).toHaveProperty('stack', mockError.stack);
    expect(result).toHaveProperty('cause', mockError.cause);
  });

  it('Should return the value when it is not an Error object', () => {
    //Arrange
    const nonErrorValue = 'nonErrorValue';

    //Act
    const result = stringifyError('key', nonErrorValue);

    // Assert
    expect(result).toBe(nonErrorValue);
  });
});
