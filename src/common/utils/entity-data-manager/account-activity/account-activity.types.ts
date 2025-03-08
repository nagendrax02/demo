import { CallerSource } from '../../rest-client';
import { IFetchDropdownPayload } from '../entity-data-manager.types';

export interface IBody extends IFetchDropdownPayload {
  code: string;
}
export interface IFetchActivityDropdownOptions {
  body: IBody;
  callerSource: CallerSource;
}
