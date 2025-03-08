import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import CancelAction from './CancelAction';
import { IAssignedLeadsCols } from './assign-leads.types';

export const gridKey = 'assign-lead';

export const scheduleEmailColDefs: IColumnDef<IAssignedLeadsCols>[] = [
  {
    id: 'leadName',
    displayName: 'Lead Name',
    width: 140,
    contentStyle: { textAlign: 'left' },
    isFirstColumn: true
  },
  {
    id: 'emailAddress',
    displayName: 'Email Address',
    width: 150,
    contentStyle: { textAlign: 'left' },
    sortable: true
  },
  {
    id: 'stage',
    displayName: 'Stage',
    contentStyle: { textAlign: 'left' },
    width: 110
  },

  {
    id: 'owner',
    displayName: 'Owner',
    contentStyle: { textAlign: 'left' },
    width: 140
  },

  {
    id: 'action',
    displayName: '',
    width: 107,
    CellRenderer: CancelAction,
    isLastFixedColumn: true
  }
];
