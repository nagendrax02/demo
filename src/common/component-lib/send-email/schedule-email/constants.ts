import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import CancelAction from './CancelAction';
import { IEmailCols } from './schdeule-email.types';

export const gridKey = 'schedule-email';

export const scheduleEmailColDefs: IColumnDef<IEmailCols>[] = [
  {
    id: 'subjectName',
    displayName: 'Subject',
    width: 195,
    isFirstColumn: true
  },
  {
    id: 'scheduledOn',
    displayName: 'Scheduled On',
    width: 215,
    sortable: true
  },
  {
    id: 'scheduledBy',
    displayName: 'Scheduled By',
    width: 215
  },
  {
    id: 'action',
    displayName: '',
    width: 77,
    CellRenderer: CancelAction,
    isLastFixedColumn: true
  }
];
