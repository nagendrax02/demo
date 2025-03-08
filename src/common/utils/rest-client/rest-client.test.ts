import { waitFor } from '@testing-library/react';
import { ERROR_MSG } from './constant';
import { httpRequest, httpGet, httpPost } from './rest-client';
import { CallerSource, HttpMethod, Module } from './rest-client.types';
import * as restClientUtils from './utils/rest-client-utils';
import * as helper from 'common/utils/helpers';
import { AUTH_HEADERS } from '../authentication/constant';

//Arrange
const path = '/path';
const url = `https://marvin.com${path}`;
const headers = { Authorization: 'auth token' };
const requestConfig = { headers };
const body = JSON.stringify({ body: 'body' });
const responseData = { leadId: 'leadId' };
const testBaseUrl = 'https://api.test.com';
const successResponseInit = {
  status: 200,
  headers: { [AUTH_HEADERS.contentType]: 'application/json' }
};
global.AbortSignal.timeout = jest.fn();
global.AbortSignal.abort = jest.fn();
global.AbortSignal.any = jest.fn();

describe('httpRequest', () => {
  it('Should throw an error when request is not successful', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({}), { ...successResponseInit, status: 404 }))
    );

    //Act and Assert

    expect(() =>
      httpRequest({ url, method: HttpMethod.Get, requestConfig, callerSource: CallerSource.NA })
    ).rejects.toBeInstanceOf(Error);
  });

  it('Should return correct response when post request is successful', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(responseData), successResponseInit))
    );

    //Act
    const response = await httpRequest({
      url,
      method: HttpMethod.Post,
      requestConfig,
      body,
      callerSource: CallerSource.NA
    });

    //Assert
    expect(response).toEqual(responseData);
  });

  it('Should throw an error when unsupported response type is provided', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(responseData), successResponseInit))
    );

    //Act && Assert
    expect(
      httpRequest({
        url,
        method: HttpMethod.Post,
        body,
        //@ts-ignore: to check invalid response type
        requestConfig: { responseType: 'INVALID' }
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('Should return json when response content type contains "json"', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(responseData), successResponseInit))
    );

    //Act
    const response = await httpRequest({
      url,
      method: HttpMethod.Post,
      requestConfig,
      body,
      callerSource: CallerSource.NA
    });

    //Assert
    expect(response).toEqual(responseData);
  });

  it('Should return text when response content type does not contains "json" and request type is JSON', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(null, {
          ...successResponseInit,
          headers: { [AUTH_HEADERS.contentType]: '' }
        })
      )
    );

    //Act
    const response = await httpRequest({
      url,
      method: HttpMethod.Post,
      requestConfig,
      body,
      callerSource: CallerSource.NA
    });

    //Assert
    expect(response).toEqual('');
  });

  it('Should throw error when response content type contains html', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(null, {
          ...successResponseInit,
          headers: { [AUTH_HEADERS.contentType]: 'text/html' }
        })
      )
    );

    //Act && Assert
    expect(
      httpRequest({
        url,
        method: HttpMethod.Post,
        requestConfig,
        body,
        callerSource: CallerSource.NA
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('Should throw error when abort signal is called', async () => {
    //Arrange
    global.fetch = jest.fn().mockImplementation(
      //@ts-ignore: For testing purpose
      new Promise((resolve) => {
        global.AbortSignal.abort();
        return resolve(new Response(null, successResponseInit));
      })
    );

    //Act & Assert
    await expect(
      httpRequest({
        url,
        method: HttpMethod.Post,
        body,
        requestConfig: { abortTimeout: 0 },
        callerSource: CallerSource.NA
      })
    ).rejects.toThrowError();
    expect(global.AbortSignal.timeout).toHaveBeenCalled();
    expect(global.AbortSignal.abort).toHaveBeenCalled();
  });
});

describe('httpGet', () => {
  it('Should throw an error when an empty path is provided"', async () => {
    //Arrange
    jest.spyOn(helper, 'getEnvConfig').mockReturnValue({ [Module.Marvin]: testBaseUrl });

    //Act & Assert
    await expect(
      httpGet({ path: '', module: Module.Marvin, callerSource: CallerSource.NA })
    ).rejects.toThrow(ERROR_MSG.emptyPath);
  });

  it('Should return correct response when get request is successful', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(responseData), successResponseInit))
    );

    //Act
    const response = await httpGet({
      path,
      module: Module.Marvin,
      requestConfig,
      callerSource: CallerSource.NA
    });

    //Assert
    expect(response).toEqual(responseData);
  });
});

describe('httpPost', () => {
  it('Should throw an error when an empty path is provided', async () => {
    //Act & Assert
    await expect(
      httpPost({ path: '', module: Module.Marvin, body: null, callerSource: CallerSource.NA })
    ).rejects.toThrow(ERROR_MSG.emptyPath);
  });

  it('Should throw an error when an invalid body is provided', async () => {
    //Act & Assert
    await expect(
      httpPost({ path: '/it', module: Module.Marvin, body: null, callerSource: CallerSource.NA })
    ).rejects.toThrow(ERROR_MSG.emptyBody);
  });

  it('Should return correct response when post request is successful', async () => {
    //Arrange
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(responseData), successResponseInit))
    );
    const body = { body: 'body' };

    //Act
    const response = await httpPost({
      path,
      module: Module.Marvin,
      body,
      requestConfig,
      callerSource: CallerSource.NA
    });

    //Assert
    expect(response).toEqual(responseData);
  });
});

describe('getRequestUrl', () => {
  it('Should return request url when valid module is passed', async () => {
    // Arrange
    const getEnvMock = jest
      .spyOn(helper, 'getEnvConfig')
      .mockReturnValue({ [Module.Marvin]: testBaseUrl });
    const getBaseUrlMock = jest.spyOn(restClientUtils, 'getBaseUrl').mockReturnValue(testBaseUrl);

    // Act
    const response = await restClientUtils.getRequestUrl(Module.Marvin, '/testpath');

    // Assert
    expect(response).toEqual(`${testBaseUrl}/testpath`);
    getEnvMock.mockRestore();
    getBaseUrlMock.mockRestore();
  });
});

describe('getBaseUrl', () => {
  it('Should return base url string when valid module is passed', async () => {
    // Arrange
    const getEnvMock = jest
      .spyOn(helper, 'getEnvConfig')
      .mockReturnValue({ [Module.Marvin]: testBaseUrl });

    // Act
    const response = await restClientUtils.getBaseUrl(Module.Marvin);

    // Assert
    expect(response).toEqual(testBaseUrl);
    getEnvMock.mockRestore();
  });

  it('Should throw error when invalid module is passed', async () => {
    // Arrange, Act & Assert
    //@ts-ignore: for testing purpose
    await expect(() => restClientUtils.getBaseUrl('INVALID_MODULE')).toThrow(ERROR_MSG.generic);
  });
});
