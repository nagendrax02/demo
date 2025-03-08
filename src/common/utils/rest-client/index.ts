import { httpGet, httpPut, httpPost, httpRequest, batchGet } from './rest-client';
import { HttpMethod, Module, CallerSource, IGet, HttpResponseType } from './rest-client.types';

export {
  httpGet,
  httpPost,
  httpRequest,
  HttpMethod,
  Module,
  CallerSource,
  HttpResponseType,
  httpPut,
  batchGet
};

export type { IGet };
