import Table from '@lsq/nextgen-preact/table';
import { safeParseJson } from 'common/utils/helpers';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import MetadataInfo from '../../../shared/metadata-info';
import styles from '../styles.module.css';
import Text from '../Text';
import { IStatusChange, IStatusChangeField } from './status-change.types';
import { COLUMN_CONFIG, EMPTY, STAGE, STATUS_CHANGE } from './constants';
import { CallerSource } from 'src/common/utils/rest-client';

const StatusChange = (props: IStatusChange): JSX.Element => {
  const {
    auditData,
    fieldDisplayName,
    oldAdditionalValue = '',
    newAdditionalValue = '',
    activityName,
    changedById = ''
  } = props;

  const { OldValue = EMPTY, NewValue = EMPTY, ChangedBy = '' } = auditData || {};

  const parsedOldAdditionalValue: IStatusChangeField[] | null = safeParseJson(oldAdditionalValue);
  const parsedNewAdditionalValue: IStatusChangeField[] | null = safeParseJson(newAdditionalValue);

  const isCfsStatus = !(!oldAdditionalValue && !newAdditionalValue);

  const isCFSPrimaryValueSame =
    oldAdditionalValue?.toLowerCase() === newAdditionalValue?.toLowerCase();

  const getRows = (): JSX.Element[] => {
    let tableRows: JSX.Element[] = [];
    const oldStage = parsedOldAdditionalValue?.find((item) => item?.DisplayName === STAGE);
    const newStage = parsedNewAdditionalValue?.find((item) => item?.DisplayName === STAGE);
    const rows = [
      {
        DisplayName: STAGE,
        OldValue: oldStage?.Value,
        NewValue: newStage?.Value
      }
    ];
    tableRows = rows.map((field) => {
      return (
        <Table.Row key={field.DisplayName} rowData={field as unknown as Record<string, string>} />
      );
    });
    return tableRows;
  };

  const getContent = (): JSX.Element => {
    if (OldValue !== NewValue) {
      if (activityName === STATUS_CHANGE) {
        return (
          <>
            changed from{' '}
            <Text
              value={OldValue}
              className={styles.source_text}
              tooltipContent={oldAdditionalValue}
            />{' '}
            to{' '}
            <Text
              value={NewValue}
              className={styles.source_text}
              tooltipContent={newAdditionalValue}
            />
          </>
        );
      }
      return (
        <>
          changed from <Text value={OldValue} className={styles.bold} /> to{' '}
          <Text value={NewValue} className={styles.bold} />
        </>
      );
    }
    return (
      <>
        <Text value={NewValue} className={styles.bold} />
        <Accordion
          name="View Details"
          defaultState={DefaultState.CLOSE}
          arrowRotate={{
            angle: ArrowRotateAngle.Deg90,
            direction: ArrowRotateDirection.ClockWise
          }}>
          <Table columns={COLUMN_CONFIG}>{getRows()}</Table>
        </Accordion>
      </>
    );
  };

  const renderStatusChange = (): JSX.Element => {
    if (isCfsStatus && !isCFSPrimaryValueSame)
      return (
        <div className={styles.text}>
          <Text value={fieldDisplayName} /> {getContent()}
        </div>
      );
    if (isCfsStatus && isCFSPrimaryValueSame)
      return <Text value={OldValue} className={styles.text} />;
    return (
      <div className={styles.text}>
        {fieldDisplayName} {getContent()}
      </div>
    );
  };

  return (
    <div data-testid="status-change">
      {renderStatusChange()}
      <MetadataInfo
        byLabel="Changed by"
        createdByName={ChangedBy}
        createdBy={changedById}
        callerSource={CallerSource.ActivityHistoryOppAuditActivity}
      />
    </div>
  );
};

export default StatusChange;
