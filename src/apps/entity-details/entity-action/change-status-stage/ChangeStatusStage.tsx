import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import styles from './change-status-stage.module.css';
import { IChangeStatusStage } from './change-status-stage.types';
import { fetchStageOptions, fetchStatusOptions } from './utils';
import { lazy, useEffect, useState } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';
import ErrorMessage from './ErrorMessage';
import UpdateAcrossPages from '../update-action/UpdateAcrossPages';
import { EntityType } from 'common/types';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));
const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const ChangeStatusStage = (props: IChangeStatusStage): JSX.Element => {
  const {
    stage,
    status,
    setStage,
    setStatus,
    bodyTitle,
    eventCode,
    setMessage,
    message,
    setStageError,
    setStatusError,
    stageError,
    statusError,
    setMessageError,
    messageError,
    config,
    gridConfig,
    entityDetailsType,
    setUpdateAllPageRecord,
    updateAllPageRecord,
    primaryEntityRepName
  } = props;

  const [stageOptions, setStageOptions] = useState<Record<string, IOption[]>>({});

  useEffect(() => {
    (async (): Promise<void> => {
      const stageOpts = await fetchStageOptions(eventCode);
      setStageOptions(stageOpts);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilteredStageOptions = (searchText?: string | undefined): IOption[] => {
    const options = stageOptions?.[status[0]?.label] || [];
    if (searchText?.length) {
      return options.filter(
        (opt) =>
          opt.label?.toLowerCase().includes(searchText?.toLowerCase()) ||
          opt.text?.toLowerCase().includes(searchText?.toLowerCase())
      );
    }
    return options;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    setMessageError(false);
  };

  const handleStatusSelect = (opts: IOption[]): void => {
    setStatus(opts);
    setStage([]);
    setStatusError(false);
    setStageError(false);
  };

  const handleStageSelect = (opts: IOption[]): void => {
    setStage(opts);
    setStageError(false);
  };

  return (
    <div className={styles.wrapper}>
      <UpdateAcrossPages
        show={gridConfig?.isSelectAll && entityDetailsType === EntityType.Opportunity}
        gridConfig={gridConfig}
        updateAllPageRecord={updateAllPageRecord}
        setUpdateAllPageRecord={setUpdateAllPageRecord}
        primaryEntityRepName={primaryEntityRepName}
      />
      <div className={styles.body_title} title={bodyTitle}>
        {bodyTitle}
      </div>
      <div className={`status_field ${styles.field}`}>
        <div className={`${styles.label} ${styles.mandatory}`}>Status</div>
        <Dropdown
          selectedValues={status}
          customStyleClass={styles.dropdown}
          fetchOptions={async (searchText?: string | undefined) => {
            return fetchStatusOptions(eventCode, searchText);
          }}
          setSelectedValues={handleStatusSelect}
          placeHolderText={'Type to search'}
          error={statusError}
        />
        {statusError ? <ErrorMessage message={'Required Field'} /> : null}
      </div>

      <div className={`stage_field ${styles.field}`}>
        <div className={`${styles.label} ${styles.mandatory}`}>Stage</div>
        <Dropdown
          selectedValues={stage}
          customStyleClass={styles.dropdown}
          fetchOptions={(searchText?: string | undefined) => {
            return getFilteredStageOptions(searchText);
          }}
          setSelectedValues={handleStageSelect}
          placeHolderText={'Select'}
          disableSearch={stageOptions?.[status[0]?.label]?.length < 1}
          useParentDropdownOptions={status}
          error={stageError}
        />
        {stageError ? <ErrorMessage message={'Required Field'} /> : null}
      </div>

      {config?.showCommentBox ? (
        <div className={`comments_field ${styles.field}`}>
          <div className={`${styles.label} ${styles.mandatory}`}>Comment</div>
          <TextArea
            handleMessageChange={handleMessageChange}
            message={message}
            placeholder="Comments"
            maxLength={config?.MaxLength || 500}
            error={messageError}
          />
          {messageError ? <ErrorMessage message={'Required Field'} /> : null}
        </div>
      ) : null}
    </div>
  );
};

export default ChangeStatusStage;
