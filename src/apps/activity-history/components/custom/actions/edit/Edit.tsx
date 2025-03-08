/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
import { useEffect, useRef, useState, lazy } from 'react';
import { trackError } from 'common/utils/experience/utils/track-error';
import { IActivityHistoryStore, IAugmentedAHDetail } from 'apps/activity-history/types';
import {
  IActionMenuItem,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { ACTIVITY, PERMISSION_ERROR_MSG } from 'apps/activity-history/constants';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { EntityType, Variant } from 'common/types';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { workAreaIds } from 'common/utils/process';
import styles from '../actions.module.css';
import { getConvertedAction } from './utils';

import { ActionWrapper } from 'common/component-lib/action-wrapper';
import Spinner from '@lsq/nextgen-preact/spinner';
import { LEAD_TYPE_ADDITIONAL_DATA_SEP, OPPORTUNITY_ENTITY_CODE } from 'common/constants';
import { CallerSource } from 'common/utils/rest-client';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import useActivityHistoryStore from 'apps/activity-history/activity-history.store';
import { getLeadType } from 'apps/entity-details/entitydetail.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const Button = withSuspense(lazy(() => import('@lsq/nextgen-preact/button')));

export interface IEdit {
  data: IAugmentedAHDetail;
  leadId: string;
  opportunityId: string;
  type?: EntityType;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

const Edit = (props: IEdit): JSX.Element | null => {
  const { data, type, entityDetailsCoreData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [showFormConfiguredAction, setShowFormConfiguredAction] = useState(false);

  const { entityIds, eventCode } = entityDetailsCoreData || {};

  //This will provide leadId in case of account lead activity history. Can be used in Edit, Delete and to get AH Data.
  const { accountLeadSelectedOption } = useActivityHistoryStore<IActivityHistoryStore>();

  const customConfig = { OpportunityId: data?.AdditionalDetails?.RelatedActivityId || '' };

  const handleMenuClose = (): void => {
    setShowFormConfiguredAction(false);
  };

  const isFormSubmissionSuccessful = useRef(false);

  const onFormClose = (): void => {
    useFormRenderer.getState().setFormConfig(null);
    if (isFormSubmissionSuccessful.current) {
      updateLeadAndLeadTabs();
      isFormSubmissionSuccessful.current = false;
    }
  };

  const [actions, setActions] = useState<IActionMenuItem>();

  const { showAlert } = useNotification();

  const getWorkAreaConfig = (): number => {
    if (entityIds?.opportunity) {
      return workAreaIds?.OPPORTUNITY_DETAILS?.EDIT_ACTIVITY;
    }
    if (entityIds?.account) {
      return workAreaIds.NA;
    }
    return workAreaIds.LEAD_DETAILS.EDIT_ACTIVITY;
  };

  const handleDefaultForms = async (): Promise<void> => {
    try {
      const processActionClickHandler = await import('./edit-button-action-handler');
      const action = {
        id: 'activityEdit',
        title: 'edit',
        workAreaConfig: {
          workAreaId: getWorkAreaConfig(),
          additionalData: eventCode ? `${eventCode}` : undefined
        }
      };
      const formConfig = await processActionClickHandler.getFormConfig({
        action,
        data,
        onSuccess: () => {
          isFormSubmissionSuccessful.current = true;
        },
        onShowFormChange: (showForm) => {
          if (!showForm) {
            onFormClose();
          }
        },
        type,
        accountLeadSelectedOption,
        entityDetailsCoreData: entityDetailsCoreData
      });
      useFormRenderer.getState().setFormConfig(formConfig);
      setShowFormConfiguredAction(false);
    } catch (error) {
      trackError(error);
    }
  };

  const getEntityData = (): Record<string, string> => {
    if (data?.ActivityEvent && data.ActivityEvent >= OPPORTUNITY_ENTITY_CODE)
      return {
        OpportunityId: (data?.Id || '') as string
      };
    else if (data?.ActivityEvent && data.ActivityEvent < OPPORTUNITY_ENTITY_CODE) {
      return {
        ActivityId: (data?.Id || '') as string,
        OpportunityId: (data?.AdditionalDetails?.RelatedActivityId || '') as string
      };
    }
    return {};
  };

  const handleMenuItemSelect = async (actionData: IActionMenuItem): Promise<void> => {
    const processFormConfig = (
      await import('apps/forms/forms-process-integration')
    ).getProcessFormConfigBasedOnProcessId({
      workAreaId: actionData?.workAreaConfig?.workAreaId ?? workAreaIds.NA,
      processId: actionData?.value ?? '',
      onSuccess: () => {
        isFormSubmissionSuccessful.current = true;
      },
      customConfig,
      formId: actionData?.formId,
      coreData: entityDetailsCoreData,
      onShowFormChange: (showForm) => {
        if (!showForm) {
          onFormClose();
        }
      },
      entityData: getEntityData()
    });
    if (processFormConfig) {
      useFormRenderer.getState().setFormConfig(processFormConfig);
    } else {
      const processActionClickHandler = await import(
        'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
      );
      const formConfig = await processActionClickHandler.getFormConfig({
        action: actionData,
        onSuccess: () => {
          isFormSubmissionSuccessful.current = true;
        },
        onShowFormChange: (showForm) => {
          if (!showForm) {
            onFormClose();
          }
        }
      });
      useFormRenderer.getState().setFormConfig(formConfig);
    }
    setShowFormConfiguredAction(false);
  };

  const getWorkAreasId = (): number => {
    if (data?.ActivityEvent && data.ActivityEvent >= OPPORTUNITY_ENTITY_CODE) {
      return workAreaIds.LEAD_DETAILS.EDIT_OPPORTUNITY;
    } else if (entityIds?.opportunity) {
      return workAreaIds?.OPPORTUNITY_DETAILS?.EDIT_ACTIVITY;
    } else if (entityIds?.account) {
      return workAreaIds.NA;
    }
    return workAreaIds.LEAD_DETAILS.EDIT_ACTIVITY;
  };

  const getAdditionalData = (): string => {
    const leadType = getLeadType();
    if (leadType) {
      return `${data.ActivityEvent}${LEAD_TYPE_ADDITIONAL_DATA_SEP}${leadType}`;
    }

    return eventCode ? `${eventCode}-${data.ActivityEvent}` : `${data.ActivityEvent}`;
  };

  useEffect(() => {
    if (showFormConfiguredAction) {
      (async (): Promise<void> => {
        try {
          setIsLoading(true);
          const fetchData = (await import('common/utils/process/process'))
            .fetchMultipleWorkAreaProcessForms;
          const processForms = await fetchData(
            [
              {
                workAreaId: getWorkAreasId(),
                additionalData: getAdditionalData()
              }
            ],
            CallerSource.ActivityHistoryCustomActivity
          );
          if (processForms) {
            const getWorkAreaId = `${getWorkAreasId()}_${getAdditionalData()}`;
            if (processForms[getWorkAreaId]) {
              const convertedAction = getConvertedAction(
                getWorkAreaId as unknown as number,
                processForms,
                false
              ) as IActionMenuItem;
              if (!convertedAction?.subMenu?.length) {
                await handleDefaultForms();
              } else if (convertedAction?.subMenu?.length === 1) {
                const convertedActionSubmenu = convertedAction.subMenu[0];
                const actionData = {
                  id: convertedAction.id,
                  title: convertedAction.title,
                  workAreaConfig: convertedActionSubmenu?.workAreaConfig,
                  value: convertedActionSubmenu?.value,
                  formId: convertedActionSubmenu?.formId
                } as IActionMenuItem;
                await handleMenuItemSelect(actionData);
              } else setActions(convertedAction);
            } else {
              await handleDefaultForms();
            }
          }
        } catch (error) {
          trackError(error);
        }
        setIsLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFormConfiguredAction]);

  const onClick = (): void => {
    if (data?.RestrictOperationsOnOpportunity) {
      showAlert({
        type: Type.ERROR,
        message: PERMISSION_ERROR_MSG
      });
      return;
    }
    setShowFormConfiguredAction(true);
  };

  const editButton = !isLoading ? (
    <Button
      text={<Icon name="edit" customStyleClass={styles.icon} variant={IconVariant.Filled} />}
      onClick={onClick}
      variant={Variant.Secondary}
      title="Edit"
      customStyleClass={styles.button}
      data-testid="ah-edit-action"
    />
  ) : (
    <Spinner customStyleClass={styles.spinner} />
  );

  const getAction = (): JSX.Element => {
    if (
      !data?.RestrictOperationsOnOpportunity &&
      (data.ActivityType === 2 ||
        data.ActivityEvent === ACTIVITY.PAYMENT ||
        data.ActivityEvent === ACTIVITY.SALES)
    ) {
      return (
        <>
          {!showFormConfiguredAction ? (
            editButton
          ) : (
            <div>
              <ActionWrapper
                action={actions as IActionMenuItem}
                key={actions?.id}
                menuKey={`${actions?.id}-${actions?.title}`}
                id={actions?.id || 'edit'}
                onMenuItemSelect={handleMenuItemSelect}
                handleMenuClose={handleMenuClose}>
                {editButton}
              </ActionWrapper>
            </div>
          )}
        </>
      );
    }
    return editButton;
  };

  return <span>{getAction()}</span>;
};

Edit.defaultProps = {
  type: '',
  entityDetailsCoreData: {}
};

export default Edit;
