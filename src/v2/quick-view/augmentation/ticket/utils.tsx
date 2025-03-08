import MergedIcon from 'assets/custom-icon/v2/MergedIcon';
import { TicketStatus } from './constants';
import React from 'react';
import styles from './ticket.module.css';
import { BadgeStatus } from '@lsq/nextgen-preact/v2/badge/badge.types';
export const getBadgeProps = (
  status: TicketStatus
): { text: React.ReactNode; status: BadgeStatus | undefined } => {
  switch (status.toLowerCase()) {
    case TicketStatus.New:
      return { text: 'New', status: 'success' };
    case TicketStatus.Parent:
      return { text: 'P', status: 'neutral' };
    case TicketStatus.Child:
      return { text: 'C', status: 'pending' };
    case TicketStatus.Merged:
      return {
        text: <MergedIcon type="outline" className={styles.merged_icon} />,
        status: 'basic'
      };
    case TicketStatus.Escalated:
      return { text: 'Escalated', status: 'lost' };
    case TicketStatus.Reopened:
      return { text: 'Reopened', status: 'pending' };
    default:
      return { text: '', status: 'neutral' };
  }
};
