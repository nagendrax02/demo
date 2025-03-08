import {
  IAuditTrailAugmentedData,
  IAuditTrailRawData,
  IAuditTrailRawEventLogData,
  IAuditTrailRawRecordData,
  IRelatedChangeRecordConfig
} from '../entity-audit-trail.types';

const getModifiedOnRowSpan = (
  record: IAuditTrailRawRecordData,
  index: number,
  relatedChangeRecordConfig?: IRelatedChangeRecordConfig
): number => {
  let rowSpan = index === 0 ? record?.EventLogs?.length : 1;
  if (record?.DoesEventContainMoreLogs || relatedChangeRecordConfig?.showRecord) {
    rowSpan += 1;
  }
  return rowSpan;
};

const getAugmentedRecord = ({
  rawRecord,
  groupIndex,
  rawEventLog,
  index,
  relatedChangeRecordConfig
}: {
  rawRecord: IAuditTrailRawRecordData;
  groupIndex: number;
  rawEventLog: IAuditTrailRawEventLogData;
  index: number;
  relatedChangeRecordConfig?: IRelatedChangeRecordConfig;
}): IAuditTrailAugmentedData => {
  return {
    displayName: rawEventLog?.FieldDisplayName,
    schemaName: rawEventLog?.FieldSchemaName,
    newValue: rawEventLog?.NewValue,
    oldValue: rawEventLog?.OldValue,
    id: rawRecord?.CorrelationId,
    modifiedOn: rawRecord?.EventPerformedOn,
    modifiedByUserName: rawRecord?.EventPerformedByUserName,
    eventType: rawEventLog?.EventType,
    showModifiedOnCell: index === 0,
    modifiedOnCellRowSpan: getModifiedOnRowSpan(rawRecord, index, relatedChangeRecordConfig),
    customClassName: `audit_trail_record_${(groupIndex + 1) % 2 === 0 ? 'even' : 'odd'}`
  };
};

const getViewRelatedChangeRecord = ({
  rawRecord,
  groupIndex,
  relatedChangeRecordConfig
}: {
  rawRecord: IAuditTrailRawRecordData;
  groupIndex: number;
  relatedChangeRecordConfig?: IRelatedChangeRecordConfig;
}): IAuditTrailAugmentedData => {
  return {
    eventType: -1,
    displayName: '',
    schemaName: '',
    newValue: '',
    oldValue: '',
    id: rawRecord?.CorrelationId,
    modifiedOn: rawRecord?.EventPerformedOn,
    modifiedByUserName: rawRecord?.EventPerformedByUserName,
    relatedChangeRecordConfig: relatedChangeRecordConfig ?? {
      showRecord: true,
      visibility: 'hide'
    },
    showModifiedOnCell: false,
    customClassName: `audit_trail_record_${(groupIndex + 1) % 2 === 0 ? 'even' : 'odd'}`
  };
};

export const getAugmentedAuditTrailData = (
  rawData: IAuditTrailRawData,
  relatedChangeRecordConfig?: IRelatedChangeRecordConfig
): Record<string, IAuditTrailAugmentedData[]> => {
  const augmentedData: Record<string, IAuditTrailAugmentedData[]> = {};
  rawData?.Records?.forEach((rawRecord, groupIndex) => {
    const augmentedEventLogs: IAuditTrailAugmentedData[] = [];
    rawRecord?.EventLogs?.forEach((rawEventLog, index) => {
      augmentedEventLogs?.push(
        getAugmentedRecord({ rawEventLog, rawRecord, index, groupIndex, relatedChangeRecordConfig })
      );
    });

    if (rawRecord?.DoesEventContainMoreLogs || relatedChangeRecordConfig) {
      augmentedEventLogs?.push(
        getViewRelatedChangeRecord({ rawRecord, groupIndex, relatedChangeRecordConfig })
      );
    }

    augmentedData[rawRecord?.CorrelationId] = augmentedEventLogs;
  });

  return augmentedData;
};
