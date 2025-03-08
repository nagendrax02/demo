import { CallerSource } from '../../rest-client';
import { IFetchDropdownPayload } from '../entity-data-manager.types';

export interface IBody extends IFetchDropdownPayload {
  Type: string;
}

export interface IFetchTaskDropdownOptions {
  body: IBody;
  callerSource: CallerSource;
}

export interface ITaskTypeOption {
  Id: string;
  Name: string;
  Color: string;
  Category: string;
}
