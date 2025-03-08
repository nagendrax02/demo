import { useBulkUpdate } from '../bulk-update.store';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import { BulkMode } from '../bulk-update.types';
import styles from './selection-mode.module.css';

const ActivityBulkSelectionMode = (): JSX.Element => {
  const { isSelectAll, totalPages, totalRecords } = useBulkUpdate(
    (state) => state.initGridConfig?.gridConfig
  );
  const { PluralName, SingularName } = useBulkUpdate((state) => state.representationName);
  const setBulkSelectionMode = useBulkUpdate((state) => state.setBulkSelectionMode);
  const bulkSelectionMode = useBulkUpdate((state) => state.bulkSelectionMode);

  const handleChange = (value: boolean): void => {
    setBulkSelectionMode({ mode: value ? BulkMode.UpdateAll : undefined });
  };

  return (
    <>
      {isSelectAll ? (
        <div className={styles?.act_bulk_selection_mode}>
          <Checkbox
            checked={bulkSelectionMode.mode === BulkMode.UpdateAll}
            changeSelection={handleChange}
          />
          <div>
            {`Update all ${totalRecords} ${
              totalRecords > 1 ? PluralName : SingularName
            } across ${totalPages} ${totalPages > 1 ? 'pages' : 'page'}`}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ActivityBulkSelectionMode;
