export interface IError {
  name: string;
  response: IResponse;
  type: string;
  swLiteRequestInfo: ISwLiteRequestInfo;
}

interface IResponse {
  Status: string;
  ExceptionType: string;
  ExceptionMessage: string;
  RequestId: string;
  Data: object;
}

interface ISwLiteRequestInfo {
  url: string;
  method: string;
  callerSource: string;
}

export enum ExceptionType {
  MXUnauthorizedRequestException = 'MXUnauthorizedRequestException',
  MXUnAuthorizedAccessException = 'MXUnAuthorizedAccessException'
}
