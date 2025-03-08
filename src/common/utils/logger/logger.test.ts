import { logger } from './logger';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import * as loggerUtils from './utils/logger-utils';

jest.mock('common/utils/authentication', () => ({
  getPersistedAuthConfig: jest.fn()
}));

beforeAll(() => {
  jest.spyOn(loggerUtils, 'logRequest').mockResolvedValue();
});

const userAgentMock =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

const authMock = {
  Tenant: { RegionId: '1' },
  User: {
    OrgCode: '6767',
    Id: '123'
  }
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fatal', () => {
  const mockLog = {
    module: 'Logger',
    method: 'logMethod',
    message: 'failed in log',
    data: { data: 123 },
    error: new Error('error')
  };
  it('Should make a fetch request when fatal log is provided', () => {
    //Arrange
    //@ts-ignore: for testing purpose
    jest.spyOn(global, 'navigator', 'get')?.mockImplementation(() => ({
      userAgent: userAgentMock,
      connection: { effectiveType: '3g' }
    }));
    (getPersistedAuthConfig as jest.Mock).mockReturnValue(authMock);

    //Act
    logger.fatal(mockLog);

    //Assert
    expect(loggerUtils.logRequest).toHaveBeenCalled();
  });

  it('Should not log the fatal when method is empty', () => {
    //Arrange
    const mockInvalidLog = {
      module: 'module',
      method: undefined,
      message: 'failed in log',
      data: { data: 123 },
      error: new Error('error')
    };

    //Act
    //@ts-ignore: for testing purpose
    logger.fatal(mockInvalidLog);

    //Assert
    expect(loggerUtils.logRequest).not.toHaveBeenCalled();
  });

  it('Should not log the fatal when module is provided as an object', () => {
    //Arrange
    const mockInvalidLog = {
      module: {},
      method: 'method',
      message: 'failed in log',
      data: { data: 123 },
      error: new Error('error')
    };

    //Act
    //@ts-ignore: for testing purpose
    logger.fatal(mockInvalidLog);

    //Assert
    expect(loggerUtils.logRequest).not.toHaveBeenCalled();
  });
  it('Should not log the fatal when message is provided as an object', () => {
    //Arrange
    const mockInvalidLog = {
      module: 'module',
      method: 'method',
      message: {},
      data: { data: 123 },
      error: new Error('error')
    };

    //Act
    //@ts-ignore: for testing purpose
    logger.fatal(mockInvalidLog);

    //Assert
    expect(loggerUtils.logRequest).not.toHaveBeenCalled();
  });
  it('Should not log the fatal when data is provided as a string', () => {
    //Arrange
    const mockInvalidLog = {
      module: 'module',
      method: 'method',
      message: 'message',
      data: 'data',
      error: new Error('error')
    };

    //Act
    //@ts-ignore: for testing purpose
    logger.fatal(mockInvalidLog);

    //Assert
    expect(loggerUtils.logRequest).not.toHaveBeenCalled();
  });

  it('Should not log the fatal when empty error is provided', () => {
    //Arrange
    const mockInvalidLog = {
      module: 'module',
      method: 'method',
      message: 'message',
      data: 'data',
      error: undefined
    };

    //Act
    //@ts-ignore: for testing purpose
    logger.fatal(mockInvalidLog);

    //Assert
    expect(loggerUtils.logRequest).not.toHaveBeenCalled();
  });
});
