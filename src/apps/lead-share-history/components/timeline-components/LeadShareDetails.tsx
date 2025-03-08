import { useEffect, useState } from 'react';
import styles from '../../lead-sh.module.css';
import { ILeadShareDetails, IShareDetail } from '../../lead-sh.types';
import { httpPost, CallerSource, Module } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getColumnConfig, getLeadShareDetailRows, shimmerRows } from '../../constants';
import Table from '@lsq/nextgen-preact/table';

const LeadShareDetails = ({ data, failedState, setActivityId }: ILeadShareDetails): JSX.Element => {
  const [tableRows, setTableRows] = useState<Record<string, string>[]>(shimmerRows);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const response: IShareDetail = await httpPost({
        path: API_ROUTES.getLeadShareDetails,
        module: Module.Marvin,
        body: {
          LeadAutoId: data.EntityId,
          ContextEntityId: data.EntityContextId,
          RequestId: data.RequestId
        },
        callerSource: CallerSource.LeadShareHistory
      });
      setTableRows(getLeadShareDetailRows(response, data, failedState));
      setIsLoading(false);
    })();
  }, []);

  const cellRenderer = (columnKey, rowData): JSX.Element => {
    if (rowData?.key === 'SharedVia' && columnKey === 'Value')
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActivityId(rowData[columnKey]);
          }}
          className={styles.shared_via}>
          {rowData[columnKey]}
        </div>
      );
    return <>{rowData[columnKey]}</>;
  };

  return (
    <Table columns={getColumnConfig()}>
      {tableRows.map((rowData) => {
        return (
          <Table.Row
            key={rowData?.Value as string}
            rowData={rowData}
            cellRenderer={cellRenderer}
            isLoading={isLoading}
          />
        );
      })}
    </Table>
  );
};

export default LeadShareDetails;
