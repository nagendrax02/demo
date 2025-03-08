import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Table from '@lsq/nextgen-preact/table';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import { API_ROUTES } from 'common/constants';
import { getEntityId } from 'common/utils/helpers';
import { IAugmentedAHDetail, IPageVisited } from 'apps/activity-history/types';
import { COLUMN_CONFIG, LOADING_ROWS } from './constants';

interface IPageVisitedInWebSiteTable {
  data: IAugmentedAHDetail;
}

const PageVisitedInWebsiteTable = ({ data }: IPageVisitedInWebSiteTable): JSX.Element => {
  const [pageData, setPageData] = useState<IPageVisited[]>([]);
  const [rowsData, setRowsData] = useState<Record<string, string | JSX.Element>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useNotification();

  const additionalDetails = data.AdditionalDetails;

  const {
    IsLandingPage,
    SessionID,
    Activity_Web_PageURL: ActivityWebpageURL,
    Activity_Web_PageTitle: ActivityWebPageTitle
  } = additionalDetails || {};

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (IsLandingPage === '0') {
          setIsLoading(true);
          const body = {
            LeadId: getEntityId() || data?.LeadId,
            SessionId: SessionID
          };

          const response = (await httpPost({
            path: API_ROUTES.activityWebVisits,
            module: Module.Marvin,
            body,
            callerSource: CallerSource.ActivityHistory
          })) as IPageVisited[];

          setIsLoading(false);
          if (response) setPageData(response);
        }
      } catch (error) {
        showAlert({
          type: Type.ERROR,
          message: error.message as string
        });
        trackError('error in ActivityHistory-Page Visited On WebSite ', error);
        setPageData([]);
        setIsLoading(false);
      }
    })();
  }, [SessionID]);

  const getRowsData = (): { Field: JSX.Element | string; Value: string }[] => {
    if (isLoading) {
      return LOADING_ROWS;
    } else if (IsLandingPage === '0') {
      return pageData.map((page) => {
        return {
          Field: (
            <a href={`${page.PageURL}`} target="_blank" rel="noopener">
              {page.PageTitle}
            </a>
          ),
          Value: page.PageURL
        };
      });
    } else {
      return [
        {
          Field: (
            <a href={`${ActivityWebpageURL}`} target="_blank" rel="noopener">
              {ActivityWebPageTitle}
            </a>
          ),
          Value: ActivityWebpageURL || ''
        }
      ];
    }
  };

  useEffect(() => {
    setRowsData(getRowsData());
  }, [pageData]);

  const renderRows = (): JSX.Element[] =>
    rowsData.map((rowData) => {
      return <Table.Row key={rowData.Value as string} rowData={rowData} />;
    });

  return (
    <>
      {rowsData.length ? (
        <Table columns={COLUMN_CONFIG.PAGE_VISITED_IN_WEBSITE_TABLE}>{renderRows()}</Table>
      ) : null}
    </>
  );
};

export default PageVisitedInWebsiteTable;
