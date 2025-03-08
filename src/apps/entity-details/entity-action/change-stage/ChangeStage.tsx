import React, { lazy, useEffect, useRef } from 'react';
import { IResponseOption, IChangeStage, ConfigType } from './change-stage.types';
import styles from './change-stage.module.css';
import { fetchCommentsOptions, fetchOption } from './utils';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));
const TextArea = withSuspense(lazy(() => import('@lsq/nextgen-preact/input/text-area')));

const ChangeStage = (props: IChangeStage): JSX.Element => {
  const {
    setDisabledSave,
    stageValue,
    setMessage,
    message,
    setSelectedOption,
    selectedOption,
    setShowError,
    config,
    setCommentsOptions,
    commentsOptions,
    showError,
    entityDetailsCoreData
  } = props;

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const { entityDetailsType, entityIds, leadType } = entityDetailsCoreData;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
    setShowError(false);
  };

  useEffect(() => {
    if (stageValue) {
      setSelectedOption([
        {
          value: stageValue,
          label: stageValue
        }
      ]);
    }
  }, [stageValue]);

  const handleSelection = (options: IResponseOption[]): void => {
    if (options.length) {
      setSelectedOption([
        {
          label: options?.[0]?.label,
          value: options?.[0]?.value
        }
      ]);
      if (options?.length && options?.[0]?.value !== stageValue && setDisabledSave) {
        setDisabledSave(false);
      } else {
        if (setDisabledSave) setDisabledSave(true);
      }
      commentRef?.current?.focus();
    } else {
      setDisabledSave?.(true);
      setSelectedOption([]);
    }
  };

  const handleCommentSelection = (options: IOption[]): void => {
    setCommentsOptions(options);
  };

  const setInitialStageValue = (options: IResponseOption[]): void => {
    if (!stageValue) {
      setSelectedOption([
        {
          value: options?.[0]?.value,
          label: options?.[0]?.label
        }
      ]);
    }
  };

  return (
    <>
      <div className={styles.dropdown_container}>
        <Dropdown
          fetchOptions={async (searchKeyWord) => {
            const options = await fetchOption({
              searchKeyWord,
              entityDetailsType,
              entityTypeId: entityIds?.EntityTypeId,
              leadType
            });
            setInitialStageValue(options);
            return options;
          }}
          setSelectedValues={handleSelection}
          showCheckIcon
          selectedValues={selectedOption}
          placeHolderText="Select"
        />
      </div>
      {config ? (
        <div>
          <div className={styles.title}>
            {config?.Label ? config?.Label : 'Change Comment'}
            {config?.IsMandatory ? <span className={styles.restricted}>*</span> : null}
          </div>
          {config?.Type?.toUpperCase() === ConfigType.Dropdown ? (
            <div className={`${styles.dropdown_container} ${styles.comment_dropdown}`}>
              <Dropdown
                fetchOptions={() => fetchCommentsOptions({ config })}
                setSelectedValues={handleCommentSelection}
                showCheckIcon
                hideClearButton
                error={showError}
                selectedValues={commentsOptions}
              />
            </div>
          ) : (
            <div className={styles.text_area_container}>
              <TextArea
                handleMessageChange={handleMessageChange}
                message={message}
                placeholder="Comments"
                innerRef={commentRef}
                maxLength={500}
                error={showError}
              />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default ChangeStage;
