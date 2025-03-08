import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import { IAuditTrailAugmentedData } from '../entity-audit-trail.types';
import ModifiedOn from './cell-renderer/ModifiedOn';
import EventLogField from './cell-renderer/EventLogField';
import OldValue from './cell-renderer/OldValue';
import NewValue from './cell-renderer/NewValue';
import styles from './cell-renderer/cell-renderer.module.css';

export const GRID_KEY = 'audit-trail';

export const AUDIT_TRAIL_COL_DEF: IColumnDef<IAuditTrailAugmentedData>[] = [
  {
    id: 'modifiedOn',
    displayName: 'Modified',
    width: 200,
    sortable: true,
    CellRenderer: ModifiedOn,
    className: styles.modified_on_cell,
    resizable: true,
    canHideCell: (data: IAuditTrailAugmentedData): boolean => {
      return !data?.showModifiedOnCell;
    },
    getRowSpan: (data: IAuditTrailAugmentedData): number => {
      if (!data?.modifiedOnCellRowSpan) return 1;
      return data?.modifiedOnCellRowSpan;
    }
  },
  {
    id: 'eventLogField',
    displayName: 'Field',
    width: 250,
    CellRenderer: EventLogField,
    className: styles.event_log_field_cell,
    resizable: true,
    getColSpan: (data: IAuditTrailAugmentedData): number => {
      return data?.relatedChangeRecordConfig?.showRecord ? 3 : 1;
    }
  },
  {
    id: 'eventLogOldValue',
    displayName: 'Old Value',
    width: 150,
    CellRenderer: OldValue,
    className: styles.old_value_cell,
    resizable: true,
    canHideCell: (data: IAuditTrailAugmentedData): boolean => {
      return !!data?.relatedChangeRecordConfig?.showRecord;
    }
  },
  {
    id: 'eventLogNewValue',
    displayName: 'New Value',
    width: 200,
    CellRenderer: NewValue,
    className: styles.new_value_cell,
    resizable: true,
    canHideCell: (data: IAuditTrailAugmentedData): boolean => {
      return !!data?.relatedChangeRecordConfig?.showRecord;
    }
  }
];

export const HIDE_RELATED_CHANGE = 'Hide Related Change';
export const VIEW_RELATED_CHANGE = 'View Related Change';
