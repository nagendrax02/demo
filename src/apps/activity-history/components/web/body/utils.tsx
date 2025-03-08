import { IRowData } from '@lsq/nextgen-preact/table/table.types';
import ConflictedRowIcon from './conflicted-row-icon';
import styles from './body.module.css';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

const conflictedDataCellRenderer = ({
  columnKey,
  fieldData,
  leadRepresentationName
}: {
  columnKey: string;
  rowData: IRowData;
  fieldData?: Record<string, string | Record<string, string>[]>;
  leadRepresentationName?: IEntityRepresentationName;
}): JSX.Element => {
  const conflictedData = fieldData?.Data as Record<string, string>[];
  if (columnKey === 'Field') {
    const displayName = conflictedData?.[0]?.Feild;
    return <>{displayName}</>;
  } else {
    const value = conflictedData?.[0]?.Value;
    return (
      <div className={styles.conflicted_row_value_wrapper}>
        {value}
        <ConflictedRowIcon fieldData={fieldData} leadRepresentationName={leadRepresentationName} />
      </div>
    );
  }
};

export default conflictedDataCellRenderer;
