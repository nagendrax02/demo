import { trackError } from 'common/utils/experience/utils/track-error';
import Button from 'common/component-lib/button/Button';
import styles from './edit.module.css';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import ButtonText from './ButtonText';
import { getConvertedEditButton, getEntityAttributeEditActionConfig } from '../utils/edit';
import Icon from '@lsq/nextgen-preact/icon';
import { useEffect, useRef, useState } from 'react';
import { IProcessFormsData, IProcessMenuItem } from 'common/utils/process/process.types';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { CallerSource } from 'common/utils/rest-client';
import { ActionType } from 'common/utils/permission-manager/permission-manager.types';
import { getEntityId } from 'common/utils/helpers';
import { IEntityDetailsCoreData } from '../../../entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { permissionEntitityType } from './constants';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

interface IEdit {
  tabId: string;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const Edit = ({ tabId, entityDetailsCoreData }: IEdit): JSX.Element => {
  const { eventCode, entityDetailsType } = entityDetailsCoreData;
  const eventCodeString = eventCode ? `${eventCode}` : undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const [isEditRestricted, setIsEditRestricted] = useState(false);
  const fieldValues = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.properties?.fields
  );
  const isFormSubmissionSuccessful = useRef(false);
  const canUpdate = fieldValues?.CanUpdate;

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const module = await import('common/utils/permission-manager');
        const isRestrict = await module.isRestricted({
          entity: permissionEntitityType[tabId].permissionType,
          action: ActionType.Update,
          entityId: entityDetailsType === EntityType.Opportunity ? `${eventCode}` : getEntityId(),
          callerSource: permissionEntitityType[tabId].callerSource
        });

        setIsEditRestricted(isRestrict);
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);

  const onFormClose = (): void => {
    useFormRenderer.getState().setFormConfig(null);
    if (isFormSubmissionSuccessful.current) {
      updateLeadAndLeadTabs();
      isFormSubmissionSuccessful.current = false;
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setIsLoading(true);
        const fetchData = (await import('common/utils/process/process'))
          .fetchMultipleWorkAreaProcessForms;
        const processForms = await fetchData(
          [getEntityAttributeEditActionConfig(tabId, eventCodeString).workAreaConfig],
          CallerSource.EntityAttributeDetails
        );
        if (processForms) setProcessFormsData(processForms);
      } catch (error) {
        trackError(error);
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertedAction = getConvertedEditButton({
    processFormsData,
    tabId,
    isLoading,
    eventCode: eventCodeString
  });
  const hasProcessForms = convertedAction?.subMenu?.length;

  const getIcon = (): JSX.Element => {
    return hasProcessForms ? <Icon name={'expand_more'} customStyleClass={styles.icon} /> : <></>;
  };

  const getStyle = (): string => {
    return `${styles.edit} ${hasProcessForms ? styles.size_with_right_icon : ''}`;
  };

  const handleActionMenuSelect = async (data: IProcessMenuItem): Promise<void> => {
    const processFormConfig = (
      await import('apps/forms/forms-process-integration')
    ).getProcessFormConfigBasedOnProcessId({
      workAreaId: data?.workAreaConfig?.workAreaId as number,
      processId: data?.value ?? '',
      additionalData: data?.workAreaConfig?.additionalData,
      formId: data?.formId,
      onSuccess: () => {
        isFormSubmissionSuccessful.current = true;
      },
      onShowFormChange: (showForm) => {
        if (!showForm) {
          onFormClose();
        }
      },
      coreData: entityDetailsCoreData
    });
    if (processFormConfig) {
      useFormRenderer.getState().setFormConfig(processFormConfig);
    }
  };

  const handleAction = async (): Promise<void> => {
    if (convertedAction?.isLoading) return;
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );
    const augmentedAction = {
      id: convertedAction.id || '',
      title: convertedAction.title || '',
      workAreaConfig: convertedAction.workAreaConfig
    };
    const formConfig = await processActionClickHandler.getFormConfig({
      action: augmentedAction,
      onSuccess: () => {
        isFormSubmissionSuccessful.current = true;
      },
      onShowFormChange: (showForm) => {
        if (!showForm) {
          onFormClose();
        }
      },
      coreData: entityDetailsCoreData
    });
    useFormRenderer.getState().setFormConfig(formConfig);
  };

  return (
    <div data-testid="lead-edit">
      {canUpdate?.toLowerCase() === 'true' && !isEditRestricted ? (
        <ActionWrapper
          menuKey={`${convertedAction.id}`}
          action={convertedAction}
          id={convertedAction.id || ''}
          onMenuItemSelect={handleActionMenuSelect}>
          <Button
            text={<ButtonText action={convertedAction} />}
            onClick={handleAction}
            customStyleClass={getStyle()}
            rightIcon={getIcon()}
            dataTestId={'edit-btn-' + (convertedAction.id || '')}
            title={convertedAction?.title}
          />
        </ActionWrapper>
      ) : null}
    </div>
  );
};

export default Edit;
