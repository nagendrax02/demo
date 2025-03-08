import React from 'react';
import styles from './ticket-vcard-properties.module.css';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { getBadgeProps } from '../../utils';
import { TicketStatus } from '../../constants';
import { ITicket } from '../../ticket.types';

interface ITicketProperties {
  ticket: ITicket;
}

const statusMappings = [
  { key: 'IsNew', status: TicketStatus.New },
  { key: 'IsParent', status: TicketStatus.Parent },
  { key: 'IsChild', status: TicketStatus.Child },
  { key: 'IsMerged', status: TicketStatus.Merged },
  { key: 'IsEscalated', status: TicketStatus.Escalated },
  { key: 'IsReopened', status: TicketStatus.Reopened }
];

const TicketVcardProperties: React.FC<ITicketProperties> = ({ ticket }) => {
  return (
    <div className={styles.ticket_properties}>
      <Badge size="md" status="neutral">
        {ticket?.Key}
      </Badge>
      <div className={styles.ticket_properties_tags}>
        {statusMappings.map(({ key, status }) => {
          const isActive = ticket?.[key as keyof typeof ticket] === 'true';
          return isActive ? (
            <Badge key={key} size="sm" status={getBadgeProps(status).status} type="semibold">
              {getBadgeProps(status).text}
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default TicketVcardProperties;
