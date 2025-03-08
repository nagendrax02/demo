import { getBrowserDetails, getOS } from '../user-agent';

beforeEach(() => {
  jest.restoreAllMocks();
});

const os = 'Mac OS X';
const browser = 'Chrome';
const browserVersion = '119.0.0.0 ';
const version = 'Version';
const userAgentMock = `Mozilla/5.0 (Macintosh; Intel ${os} 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${browserVersion} ${version}/${browserVersion} Safari/537.36`;

describe('GetOS', () => {
  it('Should return the Mac as Operating system when Mac user agent is passed', () => {
    //Arrange
    //@ts-ignore: for testing purpose
    jest.spyOn(global, 'navigator', 'get')?.mockImplementation(() => ({
      userAgent: userAgentMock
    }));

    //Act
    const result = getOS();

    //Assert
    expect(result).toBe(os);
  });

  it('Should return user agent when operating system is not recognized', () => {
    //Arrange
    //@ts-ignore: for testing purpose
    jest.spyOn(global, 'navigator', 'get')?.mockImplementation(() => ({
      userAgent: 'no os'
    }));

    //Act
    const result = getOS();

    //Assert
    expect(result).toContain('no os');
  });

  it('Should return NA when error occurs', () => {
    //Arrange
    jest.spyOn(global, 'navigator', 'get')?.mockImplementation(() => {
      throw new Error('error');
    });
    //Act
    const result = getOS();

    //Assert
    expect(result).toBe('NA');
  });
});

describe('GetBrowserDetails', () => {
  it('Should return browser details of chrome when chrome user agent passed', () => {
    //Arrange
    //@ts-ignore: for testing purpose
    jest.spyOn(global, 'navigator', 'get')?.mockImplementation(() => ({
      userAgent: userAgentMock
    }));

    //Act
    const result = getBrowserDetails();

    //Assert
    expect(result).toEqual(
      expect.objectContaining({
        browser: expect.any(String),
        version: expect.any(String)
      })
    );
  });
});
