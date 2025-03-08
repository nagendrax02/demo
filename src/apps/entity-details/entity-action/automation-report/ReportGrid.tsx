import { trackError } from 'common/utils/experience/utils/track-error';
import { IReport, IReportCols, IReportGrid, IResponse } from './automation.types';
import { gridKey, reportColDefs } from './constants';
import { Suspense, useEffect, useState } from 'react';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { EntityType } from 'common/types';
import { getFormattedDateTime } from 'common/utils/date';
import { computeLevels, handleTriggeredOn } from './utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import Spinner from '@lsq/nextgen-preact/spinner';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import HandleError from './HandleError';
import styles from './automation.module.css';
import Grid from '@lsq/nextgen-preact/grid';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

const ReportGrid = (props: IReportGrid): JSX.Element => {
  const { entityType, entityId, isLoading, setIsLoading, representationName } = props;
  const [reportRecords, setReportRecords] = useState<IReportCols[]>([]);
  const [noOfRecords, setNoOfRecords] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [isNotAPartOfAnyAutomation, setIsNotAPartOfAnyAutomation] = useState(false);

  const { showAlert } = useNotification();

  const handlePageSelect = (pageNumber: number): void => {
    setPageSelected(pageNumber);
  };

  const itemsPerPage: IOption[] = [
    {
      label: '10',
      value: '10'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    (async function handleApi(): Promise<void> {
      try {
        const path = API_ROUTES.automationReport;
        const body = {
          PageIndex: pageSelected,
          PageSize: 10,
          AutomationType: entityType === EntityType.Lead ? 1 : 6,
          EntityId: entityId
        };
        const response = (await httpPost({
          path,
          module: Module.Marvin,
          body,
          callerSource: CallerSource.LeadDetailsVCard
        })) as IResponse;

        const record: IReportCols[] = [];
        if (response?.Reports?.length && response?.TotalCount) {
          setTotalRecords(response.TotalCount);
          setNoOfRecords(response.Reports.length);
          const computedRecords: IReport[] = computeLevels(response.Reports);

          if (Array.isArray(computedRecords)) {
            computedRecords.forEach((rec, index) => {
              if (rec) {
                record.push({
                  id: index.toString(),
                  reportName: rec.Name ?? '',
                  triggeredOn: handleTriggeredOn(
                    getFormattedDateTime({ date: rec.CreatedOnString?.toString() ?? '' })
                  ),
                  securedParams: rec.SecuredParams ?? '',
                  level: rec.Level ?? 0
                });
              }
            });
          }
          setReportRecords(record);
        }
        setIsNotAPartOfAnyAutomation((response?.TotalCount || 0) === 0);
      } catch (error) {
        trackError(error);
        setReportRecords([]);
        setIsNotAPartOfAnyAutomation(true);
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.generic
        });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSelected]);

  let content: JSX.Element;

  if (isLoading) {
    content = <Spinner />;
  } else if (!isNotAPartOfAnyAutomation) {
    content = (
      <Suspense fallback={<Spinner />}>
        <Grid<IReportCols>
          gridKey={gridKey}
          gridClass={styles.automation_reports_grid_wrapper}
          columnDefs={reportColDefs}
          records={reportRecords}
          paginationConfig={{
            noOfRecords,
            pageSize: 10,
            totalRecords,
            pageSelected,
            itemsPerPage,
            handlePageSelect,
            disablePageSelection: true
          }}
          showCustomStyle
          theme={getCurrentTheme()}
        />
      </Suspense>
    );
  } else {
    content = <HandleError representationName={representationName} />;
  }

  return (
    <div
      className={`${isNotAPartOfAnyAutomation ? styles.grid_error_container : ''} ${
        styles.header_cells
      }`}>
      {content}
    </div>
  );
};

export default ReportGrid;
