import { Suspense } from 'react';
import useAuditTrailStore from '../entity-audit-trail.store';
import { AUDIT_TRAIL_COL_DEF, GRID_KEY } from './constants';
import { IAuditTrailAugmentedData, SortType } from '../entity-audit-trail.types';
import styles from './grid.module.css';
import Grid, { GridShimmer } from '@lsq/nextgen-preact/grid';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

const AuditTrailGrid = (): JSX.Element => {
  const { augmentedAuditTrailData, isGridLoading, setFetchCriteria, fetchCriteria } =
    useAuditTrailStore();

  const onGridChange = (): void => {
    setFetchCriteria({
      pageCountArray: [0],
      totalRecordCount: 0,
      pageNumber: 0,
      sortOrder: fetchCriteria?.sortOrder === SortType.Ascend ? SortType.Descend : SortType.Ascend
    });
  };

  const gridData = Object.values(augmentedAuditTrailData)?.flat();

  return (
    <div>
      {isGridLoading ? (
        <GridShimmer rows={10} columns={4} />
      ) : (
        <Suspense fallback={<GridShimmer rows={10} columns={4} />}>
          <div className={styles.grid_wrapper}>
            <Grid<IAuditTrailAugmentedData>
              enableSelection={false}
              gridKey={GRID_KEY}
              columnDefs={AUDIT_TRAIL_COL_DEF}
              records={gridData}
              onChange={onGridChange}
              config={{
                sortConfig: {
                  sortColumn: 'modifiedOn',
                  sortOrder: fetchCriteria?.sortOrder
                }
              }}
              theme={getCurrentTheme()}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default AuditTrailGrid;
