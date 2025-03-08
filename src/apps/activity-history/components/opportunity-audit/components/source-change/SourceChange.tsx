import { useState } from 'react';
import { safeParseJson } from 'common/utils/helpers';
import MetadataInfo from '../../../shared/metadata-info';
import { EMPTY } from '../status-change/constants';
import styles from '../styles.module.css';
import Text from '../Text';
import Modal from './Modal';
import { ISourceChangeField, ISourceChange, ISourceChangeData } from './source-change.types';
import { CallerSource } from 'src/common/utils/rest-client';

const SourceChange = (props: ISourceChange): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [sourceChangeData, setSourceChangeData] = useState<ISourceChangeData | null>(null);

  const {
    auditData,
    fieldDisplayName = '',
    oldAdditionalValue = '',
    newAdditionalValue = '',
    changedById = ''
  } = props;

  const { OldValue = EMPTY, NewValue = EMPTY, ChangedBy = '' } = auditData || {};

  const parsedNewAdditionalValue: ISourceChangeField[] | null = safeParseJson(newAdditionalValue);
  const parsedOldAdditionalValue: ISourceChangeField[] | null = safeParseJson(oldAdditionalValue);

  const handleSourceChange = (
    title: string,
    data: ISourceChangeField[] | null,
    isOldAndNewValueSame: boolean
  ): void => {
    if (title !== EMPTY) {
      setSourceChangeData({
        title,
        data,
        isOldAndNewValueSame
      });
      setShowModal(true);
    }
  };

  const mergeOldAndNewAdditionalValue = (): ISourceChangeField[] => {
    return parsedOldAdditionalValue?.map((oldItem) => {
      const newItem = parsedNewAdditionalValue?.find(
        (item) => item.DisplayName === oldItem.DisplayName
      );
      return {
        ...oldItem,
        OldValue: oldItem?.Value,
        NewValue: newItem?.Value
      };
    }) as ISourceChangeField[];
  };

  const getSourceTextClassName = (value: string): string => {
    let className = styles.source_text;
    if (value === EMPTY) {
      className = `${className} empty`;
    }
    return className;
  };

  const renderSourceChange = (): JSX.Element => {
    if (OldValue?.toLowerCase() === NewValue?.toLowerCase()) {
      return (
        <span
          className={getSourceTextClassName(fieldDisplayName)}
          onClick={() => {
            handleSourceChange(fieldDisplayName, mergeOldAndNewAdditionalValue(), true);
          }}>
          {fieldDisplayName}
        </span>
      );
    }
    return (
      <div className={styles.text}>
        <Text value={fieldDisplayName} /> changed from{' '}
        <Text
          value={OldValue || EMPTY}
          className={styles.source_text}
          onClick={() => {
            handleSourceChange(OldValue, parsedOldAdditionalValue, false);
          }}
        />{' '}
        to{' '}
        <Text
          value={NewValue}
          className={styles.source_text}
          onClick={() => {
            handleSourceChange(NewValue, parsedNewAdditionalValue, false);
          }}
        />
      </div>
    );
  };

  return (
    <div data-testid="source-change">
      {renderSourceChange()}
      <MetadataInfo
        byLabel="Changed by"
        createdByName={ChangedBy}
        createdBy={changedById}
        callerSource={CallerSource.ActivityHistoryOppAuditActivity}
      />
      {showModal ? (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          sourceChangeData={sourceChangeData}
        />
      ) : null}
    </div>
  );
};

export default SourceChange;
