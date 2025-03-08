import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';
export const tagStatus: Record<string, BadgeStatus> = {
  OPEN_PHONE_CALL: 'open',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  WON: 'won',
  FAILED: 'failed',
  LOST: 'lost',
  NUETRAL: 'neutral',
  CANCELLED: 'cancelled',
  SUCCESS: 'success',
  COMPLETED: 'completed',
  OPEN: 'open'
};

export const attributeMapping: Record<string, string> = {
  OPEN_PHONE_CALL: 'Open - Phone Call',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  WON: 'Won'
};
