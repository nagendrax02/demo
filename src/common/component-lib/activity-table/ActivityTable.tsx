import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import DownloadFiles from 'apps/entity-attribute-details/components/download-files';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import Table from '@lsq/nextgen-preact/table';
import { IRowData } from '@lsq/nextgen-preact/table/table.types';
import { IEntityPermissionAccess } from 'common/utils/permission-manager/permission-manager.types';
import Value from 'apps/entity-details/components/properties/Value';
import { EXCEPTION_MESSAGE } from 'common/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import Attachment from './attachment';
import {
  EventCode,
  IField,
  IActivityTable,
  IFieldRow,
  IChangeLogRow,
  IChangeLog
} from './activity-table.types';
import { getConfig } from './utils/config';
import { getFileFields, getEntityProperty, getViewRestriction } from './utils';
import * as constants from './constants';
import styles from './activity-table.module.css';
import Text from 'common/component-lib/entity-fields/text';
import { getAugmentedData } from './utils/utils';

// eslint-disable-next-line max-lines-per-function
const ActivityTable = (props: IActivityTable): JSX.Element => {
  const {
    id,
    eventCode,
    typeCode,
    additionalDetails,
    restrictAudioDownload,
    leadId,
    entityType,
    enablePermissionCheck,
    callerSource,
    leadRepresentationName,
    entityDetailsCoreData,
    isAccountActivityHistoryTab
  } = props;

  const [rowsData, setRowsData] = useState<Record<string, string | JSX.Element>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showAlert } = useNotification();

  const config = getConfig(eventCode, typeCode);

  const processFieldsData = (
    data: IField[] | IChangeLog[],
    viewRestriction: IEntityPermissionAccess | null
  ): IFieldRow[] | IChangeLogRow[] => {
    let fieldsRowData = config?.getRowConfig(data, id, eventCode, leadId, entityType) || [];
    const fileFields = getFileFields(fieldsRowData as IFieldRow[], viewRestriction) as IFieldRow[];
    if (fileFields?.length) {
      fieldsRowData = [
        ...(fieldsRowData || []),
        {
          DisplayName: constants.DOWNLOAD_FILES,
          Value: '',
          IsCFS: false,
          IsFile: true,
          IsHeading: true,
          FileFields: fileFields as IFieldRow[]
        }
      ] as IFieldRow[];
    }
    return fieldsRowData;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        setRowsData(constants.LOADING_ROWS);
        const viewRestriction = await getViewRestriction({
          eventCode,
          activityEntityType: additionalDetails?.ActivityEntityType,
          enablePermissionCheck,
          callerSource
        });

        let rowData;
        const response =
          config &&
          (await config?.dataFetcher({
            id,
            eventCode,
            typeCode,
            additionalDetails,
            restrictAudioDownload,
            callerSource,
            leadRepresentationName,
            isAccountActivityHistoryTab
          }));
        if (response) {
          const processedFieldsData = processFieldsData(response, viewRestriction);
          const augmentedData = getAugmentedData(processedFieldsData);
          const isChangeLogEvent = [EventCode.OpportunityChangeLog, EventCode.ChangeLog].includes(
            eventCode
          );
          rowData = isChangeLogEvent
            ? (augmentedData as IChangeLogRow[])
            : (augmentedData as IFieldRow[]);
        } else {
          rowData = [];
        }

        setIsLoading(false);
        setRowsData(rowData);
      } catch (error) {
        trackError('error in loading activity details', error);
        showAlert({ type: Type.ERROR, message: (error?.message as string) || EXCEPTION_MESSAGE });
        setIsLoading(false);
        setRowsData([]);
      }
    })();
  }, [id]);

  // eslint-disable-next-line complexity
  const cellRenderer = (columnKey: string, rowData: IRowData): JSX.Element | string => {
    if (
      rowData.IsFile &&
      columnKey === constants.COLUMN_KEY.VALUE &&
      rowData.FilesCSV === constants.MASKED_FILE
    ) {
      return constants.MASKED_FILE;
    }
    if (rowData.IsFile && rowData[columnKey] === constants.DOWNLOAD_FILES) {
      return (
        <DownloadFiles
          customStyleClass={styles.download_files}
          leadId={leadId as string}
          entityId={id}
          parentSchemaName={rowData.FileFields[0]?.SchemaName as string}
          data={rowData.FileFields as unknown as IAugmentedAttributeFields[]}
          hideIcon
          isActivity
          getAllCFSDataOfActivity
        />
      );
    }
    const entityProperty = getEntityProperty({
      columnKey,
      rowData,
      additionalDetails,
      activityEventCode: eventCode ? `${eventCode}` : undefined
    });
    const value = rowData[columnKey];
    const text = typeof value === 'string' ? <Text value={value as string} /> : value;

    return entityProperty ? (
      <Value
        property={entityProperty}
        fields={rowData as Record<string, string | null>}
        callerSource={callerSource}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    ) : (
      <>{text}</>
    );
  };

  console.log('ActivityTable', { rowsData, config, isLoading, cellRenderer });

  return (
    <div className={styles.activity_table_wrapper}>
      {config && rowsData?.length ? (
        <Table columns={config.getColumnConfig()}>
          {rowsData.map((rowData) => {
            return (
              <Table.Row
                key={rowData?.Value as string}
                rowData={rowData}
                isLoading={isLoading}
                cellRenderer={cellRenderer}
              />
            );
          })}
        </Table>
      ) : null}
      {additionalDetails?.HasAttachments === '1' ? (
        <Attachment activityId={id} callerSource={callerSource} leadId={leadId} />
      ) : null}
    </div>
  );
};

export default ActivityTable;
