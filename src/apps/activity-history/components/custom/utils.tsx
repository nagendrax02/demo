import { CANCELLED_ACTIVITY } from './constants';

export const isCancelledActivity = (eventNote: string): boolean => {
  return eventNote?.includes(CANCELLED_ACTIVITY);
};
