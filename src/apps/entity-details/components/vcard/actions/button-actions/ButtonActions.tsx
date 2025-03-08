import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
import styles from '../actions.module.css';
import {
  IButtonAction,
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { ActionWrapper } from 'common/component-lib/action-wrapper';
import { getCallerSource, getConvertedButtonActions, getCustomConfig } from '../utils/utils';
import HandleAction from '../handle-action';
import { useRef, useEffect, useState } from 'react';
import { IProcessFormsData, IWorkAreaConfig } from 'common/utils/process/process.types';
import { ACTION_WITHOUT_PROCESS } from '../constant';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { ACTION } from 'apps/entity-details/constants';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { EntityType, Theme } from 'common/types';
import { getAccountId } from 'common/utils/helpers/helpers';
import { workAreaIds } from 'common/utils/process';
import { getFilteredProcessActions, getUpdatedAdditionalData } from '../utils/utils';
import { skipAutoRefresh } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import { RecordType, useTabRecordCounter } from 'common/component-lib/tab-record-counter';
import Action from './Action';
import ActionWrapperV2 from 'v2/action-wrapper/ActionWrapper';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

interface IButtonActionProps {
  actions: IButtonAction[];
  onSuccess?: () => void;
  isSmartviews?: boolean;
  coreData: IEntityDetailsCoreData;
  customConfig?: Record<string, string>;
  customClass?: string;
  entityRecords?: Record<string, unknown>[];
  renderAsV2Component?: boolean;
  entityName?: string;
}

interface IOnItemSelect {
  label: string;
  value: string;
  workAreaConfig: IWorkAreaConfig;
  id?: string;
  formId?: string;
}

const ButtonActions = ({
  actions,
  coreData,
  onSuccess,
  customClass,
  isSmartviews,
  customConfig,
  entityRecords,
  renderAsV2Component,
  entityName
}: IButtonActionProps): JSX.Element => {
  const [actionClicked, setActionClicked] = useState<IButtonAction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processFormsData, setProcessFormsData] = useState<IProcessFormsData | null>(null);
  const isFormSubmissionSuccessful = useRef(false);
  const entityTypefromStore = useEntityDetailStore((state) => state.entityType);

  const { entityIds, entityDetailsType } = coreData;
  const entityType = entityDetailsType ?? entityTypefromStore;

  const primaryEntityId = entityIds?.[entityDetailsType || 'lead'];

  const { updateTabRecordCount } = useTabRecordCounter();

  const onFormSuccess = (actionId: string): void => {
    isFormSubmissionSuccessful.current = true;
    updateLeadAndLeadTabs();
    if (actionId === ACTION.Tasks) updateTabRecordCount(coreData?.entityIds?.lead, RecordType.Task);
  };

  const onFormClose = (showForm: boolean): void => {
    skipAutoRefresh(showForm);
    if (!showForm) {
      useFormRenderer.getState().setFormConfig(null);

      if (isFormSubmissionSuccessful.current) {
        isFormSubmissionSuccessful.current = false;
        onSuccess?.();
      }
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      if (!isSmartviews) {
        try {
          setIsLoading(true);
          const fetchData = (await import('common/utils/process/process'))
            .fetchMultipleWorkAreaProcessForms;
          const processForms = await fetchData(
            getFilteredProcessActions(actions),
            getCallerSource()
          );
          if (processForms) setProcessFormsData(processForms);
        } catch (error) {
          trackError(error);
        }
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertedActions = isSmartviews
    ? actions
    : getConvertedButtonActions(actions, processFormsData, isLoading);

  const handleAction = async (action: IButtonAction): Promise<void> => {
    const additionalData = getUpdatedAdditionalData(action?.workAreaConfig);
    if (action?.isLoading || action?.subMenu?.length) return;
    const processFormConfig = (
      await import('apps/forms/forms-process-integration')
    ).getProcessFormConfigBasedOnProcessId({
      workAreaId: action?.workAreaConfig?.workAreaId ?? workAreaIds.NA,
      additionalData,
      processId: action?.value ?? '',
      formId: action?.formId,
      customConfig: getCustomConfig(customConfig || {}, action?.workAreaConfig),
      onSuccess: () => {
        onFormSuccess(action?.id);
      },
      onShowFormChange: (showForm) => {
        onFormClose(showForm);
      },
      coreData
    });
    if (processFormConfig) {
      useFormRenderer.getState().setFormConfig(processFormConfig);
    } else {
      const processActionClickHandler = await import(
        'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
      );
      const formConfig = await processActionClickHandler.getFormConfig({
        action,
        entityId: primaryEntityId,
        coreData,
        customConfig,
        onSuccess: () => {
          onFormSuccess(action?.id);
          onSuccess?.();
        },
        onShowFormChange: (showForm) => {
          onFormClose(showForm);
        }
      });
      useFormRenderer.getState().setFormConfig(formConfig);
    }
    setActionClicked(action);
  };

  const handleAccountAction = async (data: IOnItemSelect): Promise<void> => {
    const leadRepresentationName = getItem(
      StorageKey.LeadRepresentationName
    ) as IEntityRepresentationName;
    const accountRepresentationName = getItem(
      StorageKey.AccountRepresentationName
    ) as IEntityRepresentationName;

    const entityId = getAccountId();

    const accountButtonAction = {
      Add_Lead: () =>
        handleAction({
          id: ACTION.AccountAddNewLead,
          isLoading: false,
          title: `Add New ${leadRepresentationName?.SingularName || 'Lead'} `,
          entityId: entityId
        }),
      Tasks: () =>
        handleAction({
          id: ACTION.AccountAddNewTasks,
          isLoading: false,
          title: 'Add New Tasks',
          entityId: entityId
        }),
      Account_Activity: () =>
        handleAction({
          id: ACTION.AccountAddNewActivity,
          isLoading: false,
          title: `Add New ${accountRepresentationName?.PluralName || 'Customer'} Activity`,
          entityId: entityId
        }),
      Lead_Activity: () =>
        handleAction({
          id: ACTION.AccountAddNewLeadActivity,
          isLoading: false,
          title: `Add New ${leadRepresentationName?.PluralName || 'Lead'} Activity`,
          entityId: entityId
        }),
      Assign_Leads: (): void => {
        setActionClicked({
          id: ACTION.AccountAssignLead,
          isLoading: false,
          title: `Assign Leads`
        });
      }
    };
    if (accountButtonAction[data?.value]) {
      accountButtonAction[data.value]();
    }
  };

  const handleMenuItemSelect = async (data: IOnItemSelect): Promise<void> => {
    if (ACTION_WITHOUT_PROCESS.includes(data?.id || '')) {
      setActionClicked({ id: data.value, title: data.label, actionHandler: {} });
    } else if (entityType === EntityType.Account) {
      handleAccountAction(data);
    } else {
      const additionalData = getUpdatedAdditionalData(data?.workAreaConfig);
      const processFormConfig = (
        await import('apps/forms/forms-process-integration')
      ).getProcessFormConfigBasedOnProcessId({
        workAreaId: data?.workAreaConfig?.workAreaId ?? '',
        processId: data?.value ?? '',
        additionalData: additionalData,
        customConfig,
        formId: data?.formId,
        onSuccess: () => {
          onFormSuccess(data?.id ?? '');
          onSuccess?.();
        },
        onShowFormChange: (showForm) => {
          onFormClose(showForm);
        },
        coreData
      });
      if (processFormConfig) {
        useFormRenderer.getState().setFormConfig(processFormConfig);
      }
    }
  };

  const getElement = (action: IButtonAction): JSX.Element => {
    const actionElement = renderAsV2Component ? (
      <ActionWrapperV2
        action={action}
        key={action.id}
        tooltipTheme={Theme.Dark}
        onMenuItemSelect={handleMenuItemSelect}>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="unstyle_button">
          <Action
            customClass={customClass}
            action={action}
            handleAction={handleAction}
            renderAsV2Component={renderAsV2Component}
          />
        </button>
      </ActionWrapperV2>
    ) : (
      <ActionWrapper
        action={action}
        key={action.id}
        menuKey={`${action.id}-${action?.title}` + (primaryEntityId ?? '')}
        id={action?.id}
        tooltipTheme={Theme.Dark}
        onMenuItemSelect={handleMenuItemSelect}>
        <div
          className={action?.isLoading ? styles.shimmer_wrapper : styles.action_text_wrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <Action customClass={customClass} action={action} handleAction={handleAction} />
        </div>
      </ActionWrapper>
    );

    return <>{actionElement}</>;
  };

  return (
    <>
      {convertedActions?.map((action) => {
        return getElement(action);
      })}
      {actionClicked ? (
        <HandleAction
          coreData={coreData}
          action={actionClicked}
          customConfig={customConfig}
          setActionClicked={setActionClicked}
          onSuccess={onSuccess}
          isSmartviews={isSmartviews}
          entityRecords={entityRecords}
          entityName={entityName}
        />
      ) : null}
    </>
  );
};

ButtonActions.defaultProps = {
  entityIds: undefined,
  customClass: '',
  isSmartviews: false,
  customConfig: {},
  onSuccess: (): void => {},
  entityRecords: undefined,
  renderAsV2Component: undefined
};

export default ButtonActions;
