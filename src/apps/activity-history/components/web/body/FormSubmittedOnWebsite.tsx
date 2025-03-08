import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { IAdditionalDetails } from 'apps/activity-history/types';
import Table from '@lsq/nextgen-preact/table';
import { safeParseJson } from 'common/utils/helpers';
import { COLUMN_CONFIG } from './constants';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
const conflictedDataCellRenderer = withSuspense(lazy(() => import('./utils')));

interface IFormSubmittedOnWebsite {
  additionalDetails: IAdditionalDetails;
  leadRepresentationName?: IEntityRepresentationName;
}

const FormSubmittedOnWebsite = (props: IFormSubmittedOnWebsite): JSX.Element => {
  const { additionalDetails, leadRepresentationName } = props;

  const { FormData, WebPublishedURL, WebContentName, TrafficSource } = additionalDetails || {};

  const parsedFormData: Record<string, string | Record<string, string>[]>[] | null = FormData
    ? safeParseJson(FormData)
    : [];

  const renderRows = parsedFormData?.map((field) => {
    const rowData = { Field: field.Feild as string, Value: field.Value as string };
    if (field?.MXConflictData) {
      return (
        <Table.Row
          key={field.field as string}
          rowData={rowData}
          isLoading={false}
          cellRenderer={(columnKey, fieldRowData, fieldData) =>
            conflictedDataCellRenderer({
              columnKey,
              rowData: fieldRowData,
              fieldData,
              leadRepresentationName
            })
          }
          fieldData={field}
        />
      );
    }
    return <Table.Row key={field.field as string} rowData={rowData} isLoading={false} />;
  }) as JSX.Element[];

  const getPublishedURL = (): JSX.Element | null => {
    return WebPublishedURL ? (
      <a href={WebPublishedURL} target="_blank" rel="noopener">
        {WebContentName}
      </a>
    ) : null;
  };

  return (
    <>
      <span>
        Viewed landing page {getPublishedURL()} and submitted form. (Activity Source -{' '}
        {TrafficSource})
      </span>
      <Accordion
        name="View Details"
        defaultState={DefaultState.CLOSE}
        arrowRotate={{
          angle: ArrowRotateAngle.Deg90,
          direction: ArrowRotateDirection.ClockWise
        }}>
        <>
          {parsedFormData?.length ? (
            <Table columns={COLUMN_CONFIG.FORM_SUBMITTED_ON_WEBSITE}>{renderRows}</Table>
          ) : null}
        </>
      </Accordion>
    </>
  );
};

export default FormSubmittedOnWebsite;
