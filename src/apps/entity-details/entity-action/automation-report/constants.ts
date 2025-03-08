import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import { IReportCols } from './automation.types';
import Action from './Action';
import ReportCellRenderer from './ReportCellRenderer';

export const gridKey = 'automation-report';

export const reportColDefs: IColumnDef<IReportCols>[] = [
  {
    id: 'reportName',
    displayName: 'Name',
    width: 406,
    contentStyle: { textAlign: 'left' },
    isFirstColumn: true,
    CellRenderer: ReportCellRenderer
  },
  {
    id: 'triggeredOn',
    displayName: 'Triggered On',
    width: 188,
    contentStyle: { textAlign: 'left' }
  },
  {
    id: 'action',
    displayName: 'Action',
    minWidth: 100,
    width: 100,
    isLastFixedColumn: true,
    CellRenderer: Action
  }
];
