import { CallerSource } from '../rest-client';

export interface IFetchDropdownPayload {
  searchText: string;
  schemaName: string;
  code?: string;
  customObjectSchemaName?: string;
  count?: number;
  SearchValues?: string[];
  relatedEntityCode?: string;
}

export interface IFetchDropdownOptions {
  body: IFetchDropdownPayload;
  callerSource: CallerSource;
  leadType?: string;
}

export interface IDropdownOption {
  value: string;
  label: string;
  text?: string;
}

interface IOptionsResponse {
  Options: IDropdownOption[];
  OptionSet: IDropdownGroupOption[];
}

export interface IDropdownGroupOption {
  label: string;
  options: IDropdownOption[];
}

export type IOptions = IDropdownOption[] | IDropdownGroupOption[];

export default IOptionsResponse;
