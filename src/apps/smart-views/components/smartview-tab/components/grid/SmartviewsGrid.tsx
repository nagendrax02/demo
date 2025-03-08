import { useEffect, useRef, useState } from 'react';
import {
  useActiveTab,
  setSortOrder,
  useSmartViewTab,
  setColumnSize,
  setPageConfig,
  setRecordCount,
  setIsGridUpdated,
  useRefreshConfig,
  useIsGridInitialized,
  setIsGridInitialized,
  useSmartViewBulkActions,
  useSmartViewGridOverlay,
  setSmartViewGridOverlay,
  skipAutoRefresh,
  useTabType,
  refreshGrid
} from '../../smartview-tab.store';
import styles from '../../smartviews-tab.module.css';
import { IBulkAction, IRecordType } from '../../smartview-tab.types';
import { IPaginationConfig } from '@lsq/nextgen-preact/grid/grid.types';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { PageSizeOptions } from 'apps/smart-views/constants/constants';
import BulkActionHandler from '../bulk-actions-handler';
import { updateSmartViewsTab } from 'apps/smart-views/smartviews-store';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { fetchGridRecords, getDisableSelection, getGridConfigColumns } from '../../utils';
import {
  endAllSvExperience,
  endSVExpEvent,
  logSVModuleUsage,
  startSVExpEvent
} from 'apps/smart-views/utils/utils';
import { SmartViewsEvents, SVUsageWorkArea } from 'common/utils/experience/experience-modules';
import { IGetIsFeatureRestriction } from 'apps/smart-views/smartviews.types';
import { FullScreenRenderer } from './FullScreenRenderer';
import Grid, { GridShimmer } from '@lsq/nextgen-preact/v2/grid';
import ManageColumnSettings from '../manage-column-settings';
import { getCornerActionConfig, scrollToFirstRow } from './utils';
import { RowHeightType } from '@lsq/nextgen-preact/common/common.types';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import SmartviewsErrorPage from '../error/SmartviewsErrorPage';
import { ICornerActionConfig } from '@lsq/nextgen-preact/v2/grid/grid.types';

// eslint-disable-next-line max-lines-per-function, complexity
const SmartviewGrid = ({
  tabId,
  featureRestriction,
  error,
  setError
}: {
  tabId: string;
  featureRestriction?: IGetIsFeatureRestriction | null;
  error: ErrorPageTypes | undefined;
  setError: React.Dispatch<React.SetStateAction<ErrorPageTypes | undefined>>;
}): JSX.Element => {
  //experience for initial SV Load Experience
  useRef(
    ((): boolean => {
      startSVExpEvent(SmartViewsEvents.GridRender, tabId);
      return true;
    })()
  );
  const [records, setRecords] = useState<IRecordType[]>([]);
  const [showManageColumns, setShowManageColumns] = useState<boolean>(false);
  const [cornerActionConfig, setCornerActionConfig] = useState<ICornerActionConfig>();
  const [pageConfig, setPageData] = useState<IPaginationConfig>({} as IPaginationConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [bulkAction, setBulkAction] = useState<IBulkAction | null>(null);
  const tabData = useSmartViewTab(tabId);
  const activeTabId = useActiveTab();
  const bulkActions = useSmartViewBulkActions();
  const isInitialRender = useRef(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const { gridConfig, headerConfig } = tabData || {};

  const isGridInitialized = useIsGridInitialized();

  useEffect(() => {
    (async (): Promise<void> => {
      setCornerActionConfig(await getCornerActionConfig(tabId, setShowManageColumns));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && !isGridInitialized) setIsGridInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const refreshConfig = useRefreshConfig();

  const overlay = useSmartViewGridOverlay();

  const tabType = useTabType();

  const handlePageSelect = (pageNumber: number): void => {
    let pageSize = pageConfig.pageSize;
    setPageData((config) => {
      pageSize = config.pageSize;
      return {
        ...config,
        pageSelected: pageNumber
      };
    });
    setPageConfig(tabId, {
      pageIndex: pageNumber,
      pageSize: pageSize || parseInt(PageSizeOptions[0].value)
    });
  };

  const handlePageSizeSelection = (pageSize: IOption): void => {
    setPageData((config) => ({
      ...config,
      pageSize: parseInt(pageSize.value, 10)
    }));
    setPageConfig(tabId, { pageIndex: 1, pageSize: parseInt(pageSize.value, 10) });
    if (gridConfig?.fetchCriteria?.PageSize !== parseInt(pageSize?.value, 10)) {
      logSVModuleUsage(tabId, SVUsageWorkArea.GridPageSize, {
        workAreaValue: parseInt(pageSize?.value, 10)
      });
    }
  };

  const fetchTabData = async (requestorTabId: string): Promise<void> => {
    const { gridRecords, config, count } = await fetchGridRecords({
      gridConfig,
      handlePageSelect,
      handlePageSizeSelection,
      tabId,
      headerConfig,
      setError,
      tabData
    });
    if (requestorTabId === activeTabId) {
      setRecordCount(tabId, count);
      setRecords(gridRecords);
      if (config) setPageData(config);

      // Ensures that grid store stays updated when current selected page (> 1) doesnt have any records and page is reset to 1
      if (config?.pageSelected && config?.pageSelected !== gridConfig?.fetchCriteria?.PageIndex) {
        handlePageSelect(config.pageSelected);
      }
    } else {
      setRecordCount(tabId, 0);
      setRecords([]);
    }
  };

  const startLoading = (): void => {
    if (isInitialRender.current) setLoading(true);
    else {
      setIsGridUpdated(false);
      setSmartViewGridOverlay(true);
    }
  };

  const stopLoading = (): void => {
    if (isInitialRender.current) {
      setLoading(false);
      isInitialRender.current = false;
    } else {
      setSmartViewGridOverlay(false);
      setIsGridUpdated(true);
      updateSmartViewsTab(tabId, tabData);
    }
  };

  // Using stringified fetch criteria as dependency to compare change as customFilters in account tab is array and
  // shallow comparision will always take customFilters as new array even though nothing is changed
  const stringifiedFetchCriteria = JSON.stringify(gridConfig.fetchCriteria);
  const stringifiedColumnConfig = JSON.stringify(gridConfig.columnConfigMap);

  useEffect(() => {
    (async (): Promise<void> => {
      if (gridConfig && activeTabId === tabId) {
        //  experience for initial SVTabLoad Experience
        startSVExpEvent(SmartViewsEvents.GridRender, tabId);
        startLoading();
        await fetchTabData(tabId);
        scrollToFirstRow(gridRef);
        stopLoading();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedFetchCriteria, stringifiedColumnConfig, refreshConfig?.timeStamp, activeTabId]);

  const handleBulkActions = (action: IMenuItem, selectedRows: Record<string, unknown>): void => {
    setBulkAction({
      action,
      selectedRows
    });
  };

  const onGridMount = (): void => {
    if (!loading) {
      endSVExpEvent(SmartViewsEvents.GridRender, tabId);
      endAllSvExperience(tabData);
    }
  };

  return (
    <div className={styles.grid_container}>
      {error && !loading ? (
        <SmartviewsErrorPage
          tabId={tabId}
          type={error}
          handleRefresh={() => {
            refreshGrid(tabId);
          }}
          setError={setError}
        />
      ) : null}
      {!error && !loading ? (
        <Grid<IRecordType>
          columnDefs={getGridConfigColumns(featureRestriction, gridConfig.columns)}
          records={records}
          gridKey={tabId}
          gridClass={styles.smartviews_grid}
          enableSelection={getDisableSelection(
            featureRestriction,
            tabId,
            gridConfig.disableSelection
          )}
          onChange={(config) => {
            setSortOrder(tabId, config.sortConfig);
          }}
          onResize={(config) => {
            setColumnSize(tabId, config);
          }}
          skipAutoRefresh={skipAutoRefresh}
          showOverlay={overlay}
          paginationConfig={{ ...pageConfig }}
          config={{
            sortConfig: {
              sortColumn: gridConfig.fetchCriteria.SortOn,
              sortOrder: gridConfig.fetchCriteria.SortBy
            },
            rowHeight: RowHeightType.Default,
            tabType
          }}
          expandableConfig={
            gridConfig?.expandableComponent
              ? { expandableComponent: gridConfig.expandableComponent }
              : undefined
          }
          onRowClick={gridConfig.onRowClick}
          bulkActions={bulkActions}
          handleBulkActions={handleBulkActions}
          bulkRestrictedDataPromise={gridConfig.bulkRestrictedDataPromise}
          onMount={onGridMount}
          dataTestId={'sv-grid'}
          cornerActionConfig={cornerActionConfig}
          gridRef={gridRef}
        />
      ) : null}
      <FullScreenRenderer records={records} activeTabId={activeTabId} />
      {loading && !records.length ? <GridShimmer /> : null}
      {bulkAction ? (
        <BulkActionHandler
          bulkAction={bulkAction}
          setBulkAction={setBulkAction}
          tabId={tabId}
          fetchCriteria={gridConfig.fetchCriteria}
          pageConfig={pageConfig}
          records={records}
        />
      ) : null}
      <ManageColumnSettings
        setShow={setShowManageColumns}
        show={showManageColumns}
        activeTabId={activeTabId}
        featureRestriction={featureRestriction}
      />
    </div>
  );
};

SmartviewGrid.defaultProps = {
  tabId: '',
  featureRestriction: {}
};

export default SmartviewGrid;
