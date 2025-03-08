import { DataType } from '@lsq/nextgen-preact/common/common.types';
import { IEntityProperty, RenderType } from 'src/common/types/entity/lead/metadata.types';

export const TicketProperties: IEntityProperty[] = [
  {
    id: 'ticketDescription',
    name: 'Description',
    value: '',
    fieldRenderType: RenderType.TextArea,
    schemaName: 'Description',
    dataType: DataType.Text
  },
  {
    id: 'ticketLeadName',
    name: 'Customer name',
    value: '',
    fieldRenderType: RenderType.Text,
    schemaName: 'LeadName',
    dataType: DataType.Text
  },
  {
    id: 'ticketLeadPhone',
    name: 'Phone number',
    value: '',
    fieldRenderType: RenderType.Phone,
    schemaName: 'LeadPhone',
    dataType: DataType.Phone
  },
  {
    id: 'ticketCreatedOn',
    name: 'Created on',
    value: '',
    fieldRenderType: RenderType.Date,
    schemaName: 'CreatedOn',
    dataType: DataType.Date
  },
  {
    id: 'ticketTicketOwner',
    name: 'Ticket owner',
    value: '',
    fieldRenderType: RenderType.Text,
    schemaName: 'LeadPhone',
    dataType: DataType.Text
  }
];

export enum TicketStatus {
  New = 'new',
  Parent = 'parent',
  Child = 'child',
  Merged = 'merged',
  Escalated = 'escalated',
  Reopened = 'reopened'
}
