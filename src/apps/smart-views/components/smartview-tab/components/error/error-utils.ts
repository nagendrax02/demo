import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';

export const showHeaderActions = (error?: ErrorPageTypes): boolean => {
  const headerActionRestrictedErrors = [
    'teamNotified',
    'unexpectedError',
    'connectionError',
    'emptyRecords'
  ];
  if (error && headerActionRestrictedErrors?.includes(error)) {
    return false;
  }
  return true;
};

export const showSearchAndFilters = (error?: ErrorPageTypes): boolean => {
  // TODO: discuss empty records error behavior with PMs - https://leadsquared.atlassian.net/browse/SW-6341
  // const SearchAndFilterRestrictedErrors = ['emptyRecords'];
  const SearchAndFilterRestrictedErrors: string[] = [];
  if (error && SearchAndFilterRestrictedErrors?.includes(error)) {
    return false;
  }
  return true;
};
