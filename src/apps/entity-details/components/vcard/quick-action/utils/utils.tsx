import { trackError } from 'common/utils/experience/utils/track-error';
import { IQuickActionConfig } from 'apps/entity-details/types';
import { convertToProcessAction } from 'common/utils/process/process';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { getLeadName } from 'apps/entity-details/utils';
import { getEntityId } from 'common/utils/helpers';
import { ACTION, CONVERSE, LEAD_QUICK_ACTION_CONFIG } from 'apps/entity-details/constants';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { workAreaIds } from 'common/utils/process';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

const getConvertedQuickActions = (
  actions: IQuickActionConfig[],
  processFormsData: IProcessFormsData | null,
  canUpdate?: string | null
): IQuickActionConfig[] => {
  if (!actions?.length || !processFormsData) {
    return actions;
  }
  let augmentedActions = actions;
  if (canUpdate !== 'true') {
    augmentedActions = actions.filter((action) => action.id !== ACTION.LeadDetailEditVCard);
  }

  return augmentedActions?.map((action) => {
    const convertedAction = convertToProcessAction({ action, processFormsData });
    const totalForms = convertedAction?.subMenu?.length;
    let toolTip = convertedAction.toolTip;
    if (totalForms === 1) {
      toolTip = convertedAction?.subMenu?.[0]?.label;
    }
    return {
      ...convertedAction,
      subMenu: totalForms === 1 ? [] : convertedAction?.subMenu,
      toolTip
    };
  });
};

const handleConverseClick = async (
  fieldValues: Record<string, string | null> | undefined
): Promise<void> => {
  try {
    const module = await import('apps/external-app');
    module.triggerConverse(getEntityId(), getLeadName(fieldValues));
  } catch (error) {
    trackError(error);
  }
};

interface IOnItemSelect {
  label: string;
  value: string;
  formId?: string;
  workAreaConfig?: {
    workAreaId: number;
    additionalData?: string;
    fallbackAdditionalData?: string;
  };
}

export const handleMenuItemSelect = async (
  data: IOnItemSelect,
  coreData: IEntityDetailsCoreData
): Promise<void> => {
  const processFormConfig = (
    await import('apps/forms/forms-process-integration')
  ).getProcessFormConfigBasedOnProcessId({
    workAreaId: data?.workAreaConfig?.workAreaId ?? -1,
    processId: data?.value ?? '',
    formId: data?.formId,
    additionalData: data?.workAreaConfig?.additionalData,
    onSuccess: () => {
      updateLeadAndLeadTabs();
    },
    onShowFormChange: (showForm) => {
      if (!showForm) {
        useFormRenderer.getState().setFormConfig(null);
      }
    },
    coreData
  });
  if (processFormConfig) {
    useFormRenderer.getState().setFormConfig(processFormConfig);
  }
};

const handleAction = async (
  action: IQuickActionConfig,
  coreData: IEntityDetailsCoreData
): Promise<void> => {
  const processActionClickHandler = await import(
    'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
  );
  const formConfig = await processActionClickHandler.getFormConfig({
    action: {
      workAreaConfig: action?.workAreaConfig ?? { workAreaId: workAreaIds.NA },
      id: action.id ?? action?.name,
      title: action?.title ?? action?.name,
      formTitle: action?.formTitle
    },
    coreData,
    onSuccess: () => {
      updateLeadAndLeadTabs();
    },
    onShowFormChange: (showForm) => {
      if (!showForm) {
        useFormRenderer.getState().setFormConfig(null);
      }
    }
  });

  if (formConfig) {
    useFormRenderer.getState().setFormConfig(formConfig);
  }

  if (!formConfig && action?.onClick) {
    action.onClick();
  }
};

interface IHandleActionClick {
  actionConfig: IQuickActionConfig;
  fieldValues: Record<string, string | null> | undefined;
  setShowLeadShare: React.Dispatch<React.SetStateAction<boolean>>;
  coreData: IEntityDetailsCoreData;
}

export const handleActionClick = async ({
  actionConfig,
  fieldValues,
  setShowLeadShare,
  coreData
}: IHandleActionClick): Promise<void> => {
  if (actionConfig?.name === CONVERSE?.toLowerCase()) {
    handleConverseClick(fieldValues);
    return;
  }
  if (actionConfig?.name === LEAD_QUICK_ACTION_CONFIG.leadShare.name) {
    setShowLeadShare(true);
    return;
  }
  handleAction(actionConfig, coreData);
};

export { getConvertedQuickActions, handleConverseClick };
