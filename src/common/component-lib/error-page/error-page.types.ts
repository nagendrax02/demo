export type Variant = 'error' | 'empty';

export type ErrorPageTypes =
  | 'noMatchingRecords'
  | 'emptyRecords'
  | 'teamNotified'
  | 'accessDenied'
  | 'connectionError'
  | 'unexpectedError';

export interface IPage {
  variant: Variant;
}
