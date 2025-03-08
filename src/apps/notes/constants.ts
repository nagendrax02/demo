import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';

export const DEFAULT_DATE = {
  value: 'all_time',
  label: 'All Time',
  startDate: '',
  endDate: ''
};

export const DEFAULT_PAGE_SIZE = 25;

export const alertConfig = {
  DELETE_NOTE_FAIL: {
    type: Type.ERROR,
    message: 'Failed to delete note'
  },
  DELETE_NOTE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Note deleted successfully'
  },
  ADD_NOTE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Note added successfully'
  },
  ADD_NOTE_FAIL: {
    type: Type.ERROR,
    message: 'Failed to add note'
  },
  UPDATE_NOTE_SUCCESS: {
    type: Type.SUCCESS,
    message: 'Note updated successfully'
  },
  UPDATE_NOTE_FAIL: {
    type: Type.ERROR,
    message: 'Failed to update note'
  },
  GENERIC: {
    type: Type.ERROR,
    message: ERROR_MSG.generic
  }
};
