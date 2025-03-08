import { CallerSource } from '../../rest-client';

interface IBody {
  count: number;
  schemaName: string;
  searchText: string;
  code: string;
}

interface IFetchAccountDropdownOptions {
  body: IBody;
  callerSource: CallerSource;
}

export type { IFetchAccountDropdownOptions, IBody };
