import { ACTION } from 'apps/entity-details/constants';
import { API_ROUTES } from 'common/constants';

export const HEADINGS = {
  [ACTION.BulkListHide]: 'Hide Selected Lists',
  [ACTION.BulkListUnhide]: 'Unhide Selected Lists',
  [ACTION.ListBulkDelete]: 'Delete Selected Lists',
  [ACTION.ListHide]: 'Hide List',
  [ACTION.ListUnhide]: 'Unhide List',
  [ACTION.ListDelete]: 'Delete List'
};

export const SUB_HEADINGS = {
  [ACTION.BulkListHide]: 'Are you sure you want to hide selected lists?',
  [ACTION.BulkListUnhide]: 'Are you sure you want to Unhide selected lists?',
  [ACTION.ListBulkDelete]: 'Are you sure you want to delete selected lists?',
  [ACTION.ListHide]: 'Are you sure you want to hide this list {listName}?',
  [ACTION.ListUnhide]: 'Are you sure you want to unhide this list {listName}?',
  [ACTION.ListDelete]: 'Are you sure you want to delete this list {listName}?'
};

export const DESCRIPTIONS = {
  [ACTION.ListHide]: 'This will be available in hidden list.',
  [ACTION.ListDelete]: 'Deleting will remove all related records.'
};

export const OPERATIONS = {
  [ACTION.BulkListHide]: 'Hide',
  [ACTION.BulkListUnhide]: 'Unhide',
  [ACTION.ListHide]: 'Hide',
  [ACTION.ListUnhide]: 'Unhide'
};

export const ACTION_MESSAGE = {
  [ACTION.BulkListHide]: '{recordName} {list} hidden successfully',
  [ACTION.BulkListUnhide]: '{recordName} {list} removed from hidden list successfully',
  [ACTION.ListBulkDelete]: '{recordName} {list} deleted successfully',
  [ACTION.ListHide]: 'List {recordName} hidden successfully',
  [ACTION.ListUnhide]: '{recordName} removed from hidden list successfully',
  [ACTION.ListDelete]: 'List {recordName} deleted successfully'
};

export const FAILURE_MESSAGE =
  'Lists are associated with Drip Campaigns or Email Campaign or Landing Page or Referral Campaign or Automation. Hence it cannot be Deleted';

export const MODAL_MESSAGES = {
  [ACTION.ListBulkDelete]: {
    title: 'Could not delete all selected lists',
    successMessage: 'deleted successfully',
    failureMessage: 'could not be deleted',
    failureDescription:
      'Lists are associated with Drip Campaigns or Email Campaign or Landing Page or Referral Campaign or Automation.'
  }
};

export const API = {
  [ACTION.BulkListHide]: API_ROUTES.listBulkUpdate,
  [ACTION.BulkListUnhide]: API_ROUTES.listBulkUpdate,
  [ACTION.ListBulkDelete]: API_ROUTES.listBulkDelete,
  [ACTION.ListHide]: API_ROUTES.listBulkUpdate,
  [ACTION.ListUnhide]: API_ROUTES.listBulkUpdate,
  [ACTION.ListDelete]: API_ROUTES.listBulkDelete
};

export const SUCCESS_BUTTON = {
  [ACTION.BulkListHide]: 'Yes, Hide',
  [ACTION.BulkListUnhide]: 'Yes, Unhide',
  [ACTION.ListBulkDelete]: 'Yes, Delete',
  [ACTION.ListHide]: 'Yes, Hide',
  [ACTION.ListUnhide]: 'Yes, Unhide',
  [ACTION.ListDelete]: 'Yes, Delete'
};
