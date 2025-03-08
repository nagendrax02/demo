/* eslint-disable complexity */
import { IFormsConfiguration } from 'src/apps/forms/forms.types';
import {
  IGenerateActivityFormConfig,
  IGenerateLeadEdotFormConfig,
  IGenerateOpportunityFormConfig,
  IGenerateProcessFormConfig,
  IGenerateQuickLeadDetailEditFormConfig,
  IGenerateTaskFormConfig,
  IHandleProcessFormConfigGenerationForAction
} from './button-actions.types';
import { workAreaIds } from 'src/common/utils/process/constant';
import { ACTION, salesActivityInfo } from 'src/apps/entity-details/constants';
import { getEntityId } from 'src/common/utils/helpers';
import { DefaultFormEntity, ProcessType } from 'src/apps/forms/default-forms-config.types';
import { getAccountId, getAccountTypeId } from 'common/utils/helpers/helpers';
import { IActionBtnForProcess } from './button-actions.types';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { getLeadType } from 'apps/entity-details/entitydetail.store';

export async function handleProcessFormConfigGenerationForAction({
  action,
  defaultFormConfigGenerator,
  customConfig,
  coreData
}: IHandleProcessFormConfigGenerationForAction): Promise<IFormsConfiguration | null> {
  const processIntegrationHelper = await import('apps/forms/forms-process-integration');
  const { workAreaConfig } = action;
  const workAreaProcessDetails = processIntegrationHelper.getProcessDetailsBasedOnWorkAreaId({
    workAreaConfig
  });
  if (defaultFormConfigGenerator && !workAreaProcessDetails?.ActionOutputs?.length) {
    return defaultFormConfigGenerator();
  }
  if (workAreaProcessDetails && workAreaProcessDetails?.ActionOutputs?.length === 1) {
    const processActionOutput = processIntegrationHelper.findProcessActionOutput({
      workAreaProcessDetails
    });
    const generatedFormsDataBasedOnProcess =
      processIntegrationHelper.generateFormsDataFromProcessData({
        processData: processActionOutput,
        customConfig,
        coreData
      });
    return generatedFormsDataBasedOnProcess;
  }
  return null;
}

const generateFormConfig = async ({
  action,
  config,
  coreData,
  customConfig
}: {
  action: IActionBtnForProcess;
  config: IFormsConfiguration;
  coreData?: IEntityDetailsCoreData;
  customConfig?: Record<string, string>;
}): Promise<IFormsConfiguration | null> => {
  if (
    !action?.workAreaConfig?.workAreaId ||
    action?.workAreaConfig?.workAreaId === workAreaIds.NA
  ) {
    return config;
  } else {
    const formsConfig = handleProcessFormConfigGenerationForAction({
      action,
      defaultFormConfigGenerator: () => config,
      customConfig,
      coreData
    });
    return formsConfig;
  }
};

export async function generateOpportunityFormConfig({
  action,
  entityId,
  customConfig,
  bulkConfig
}: IGenerateOpportunityFormConfig): Promise<IFormsConfiguration | null> {
  const opportunityFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: DefaultFormEntity?.OPPORTUNITY ?? 1,
      Type: ProcessType?.ADDNEW ?? 0,
      IsDefaultForm: true,
      LeadId: entityId ?? getEntityId(),
      IsBulkAction: customConfig?.IsBulkAction?.toLowerCase() === 'true' ? true : false,
      BulkConfig: bulkConfig
    }
  };
  if (
    !action?.workAreaConfig?.workAreaId ||
    action?.workAreaConfig?.workAreaId === workAreaIds.NA
  ) {
    return opportunityFormConfig;
  } else {
    const formsConfig = handleProcessFormConfigGenerationForAction({
      action,
      defaultFormConfigGenerator: () => opportunityFormConfig
    });
    return formsConfig;
  }
}

export async function generateTaskFormConfig({
  action,
  entityId,
  customConfig
}: IGenerateTaskFormConfig): Promise<IFormsConfiguration | null> {
  const taskFormConfig: IFormsConfiguration = {
    Config: {
      Name: action?.formTitle || action?.title || action?.toolTip,
      Entity: DefaultFormEntity?.TASK ?? 3,
      Type: ProcessType?.ADDNEW ?? 0,
      IsDefaultForm: true,
      LeadId: entityId ?? getEntityId(),
      EntityType: customConfig?.TaskTypeId,
      TaskId: customConfig?.UserTaskId,
      ...(customConfig || {})
    }
  };
  if (action.id === ACTION.AddTaskForLead) {
    taskFormConfig.Config = {
      ...taskFormConfig.Config,
      Name: action?.title || action?.toolTip,
      EntityType: '',
      TaskId: ''
    };
  }
  if (
    !action?.workAreaConfig?.workAreaId ||
    action?.workAreaConfig?.workAreaId === workAreaIds.NA
  ) {
    return taskFormConfig;
  } else {
    const formsConfig = handleProcessFormConfigGenerationForAction({
      action,
      defaultFormConfigGenerator: () => taskFormConfig,
      customConfig
    });
    return formsConfig;
  }
}

const addPropsBasedOnEntityType = (
  entityId: string,
  coreData?: IEntityDetailsCoreData
): Record<string, string> => {
  if (coreData?.entityIds?.account && getAccountId()) {
    return {
      LeadId: '',
      AccountId: entityId
    };
  }
  return {
    LeadId: coreData?.entityIds?.lead ?? entityId ?? getEntityId()
  };
};

// eslint-disable-next-line complexity
export async function generateActivityFormConfig({
  action,
  entityId,
  coreData,
  customConfig,
  bulkConfig
}: IGenerateActivityFormConfig): Promise<IFormsConfiguration> {
  const baseConfig = {
    Name: action.title || action?.toolTip,
    Entity: DefaultFormEntity?.ACTIVITY ?? 2,
    Type: ProcessType?.ADDNEW ?? 0,
    IsDefaultForm: true,
    EntityType: customConfig?.EntityType,
    ActivityId: coreData?.entityIds?.activity,
    OpportunityId: coreData?.entityIds?.opportunity,
    IsBulkAction: customConfig?.IsBulkAction?.toLowerCase() === 'true' ? true : false,
    BulkConfig: bulkConfig,
    ...(action.id === ACTION.Activity &&
      customConfig?.IsActivityRestricted === 'true' && {
        IsActivityRestricted: true
      }),
    ...addPropsBasedOnEntityType(entityId || '', coreData)
  };
  if (action.id === ACTION.SalesActivity) {
    const salesActivityFormConfig: IFormsConfiguration = {
      Config: {
        ...baseConfig,
        EntityType: salesActivityInfo.ENTITY_TYPE
      }
    };
    return salesActivityFormConfig;
  } else {
    const activityFormConfig: IFormsConfiguration = {
      Config: baseConfig
    };
    return activityFormConfig;
  }
}

export const addActivityForLeadWrapper = async ({
  action,
  entityId,
  coreData,
  customConfig
}: IGenerateActivityFormConfig): Promise<IFormsConfiguration> => {
  if (customConfig) customConfig.EntityType = '';
  return generateActivityFormConfig({
    action,
    entityId,
    coreData,
    customConfig
  });
};

export async function generateProcessFormConfig({
  action
}: IGenerateProcessFormConfig): Promise<IFormsConfiguration | null> {
  const formsConfig = await handleProcessFormConfigGenerationForAction({
    action
  });
  return formsConfig;
}

export async function generateQuickLeadDetailEditFormConfig({
  action,
  entityId
}: IGenerateQuickLeadDetailEditFormConfig): Promise<IFormsConfiguration | null> {
  const leadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: DefaultFormEntity?.LEAD ?? 0,
      Type: ProcessType?.VCARDPROPERTIES ?? 3,
      IsDefaultForm: true,
      LeadId: entityId ?? getEntityId(),
      EntityType: getLeadType()
    }
  };
  if (
    !action?.workAreaConfig?.workAreaId ||
    action?.workAreaConfig?.workAreaId === workAreaIds.NA
  ) {
    return leadFormConfig;
  } else {
    const formsConfig = handleProcessFormConfigGenerationForAction({
      action,
      defaultFormConfigGenerator: () => leadFormConfig
    });
    return formsConfig;
  }
}

export async function generateLeadEditFormConfig({
  action,
  entityId,
  customConfig,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const leadType = coreData?.leadType;
  const leadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: DefaultFormEntity?.LEAD ?? 0,
      Type: ProcessType?.ADDNEW ?? 0,
      IsDefaultForm: true,
      LeadId: entityId ?? getEntityId(),
      EntityType: getLeadType(),
      ...(customConfig || {})
    }
  };
  if (leadType) {
    leadFormConfig.Config.EntityType = leadType;
  }
  if (
    !action?.workAreaConfig?.workAreaId ||
    action?.workAreaConfig?.workAreaId === workAreaIds.NA
  ) {
    return leadFormConfig;
  } else {
    const formsConfig = handleProcessFormConfigGenerationForAction({
      action,
      customConfig,
      defaultFormConfigGenerator: () => leadFormConfig
    });
    return formsConfig;
  }
}

export async function generateAccountDetailEditVCardFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 5,
      Type: 1,
      IsDefaultForm: true,
      AccountId: getAccountId(),
      EntityType: getAccountTypeId(),
      LeadId: getAccountId()
    }
  };

  return generateFormConfig({ action, config: accountFormConfig });
}

export async function generateAccountAddNewTaskFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 3,
      Type: 0,
      IsDefaultForm: true,
      AccountId: action?.entityId
    }
  };

  return generateFormConfig({ action, config: accountAddLeadFormConfig });
}

export async function generateAccountAttributeDetailsEditFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title,
      Entity: 5,
      Type: 0,
      IsDefaultForm: true,
      EntityTypeId: getAccountTypeId(),
      AccountId: getAccountId(),
      EntityType: getAccountTypeId()
    }
  };

  return generateFormConfig({ action, config: accountFormConfig });
}

export async function generateAccountAddNewLeadFormConfig({
  action,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 0,
      Type: 0,
      IsDefaultForm: true,
      AccountId: customConfig?.CompanyId ?? action?.entityId
    }
  };

  return generateFormConfig({ action, config: accountAddLeadFormConfig });
}

export async function generateAccountAddNewActivityFormConfig({
  action,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action.toolTip,
      Entity: 6,
      Type: 0,
      IsDefaultForm: true,
      AccountId: customConfig?.CompanyId ?? action?.entityId,
      RelatedEntityType: {
        AccountCode: customConfig?.entityCode ?? getAccountTypeId()
      }
    }
  };

  return generateFormConfig({ action, config: accountAddLeadFormConfig });
}

export async function generateAccountEditActivityFormConfig({
  action,
  customConfig,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title,
      Entity: 6,
      Type: 0,
      IsDefaultForm: true,
      RelatedEntityType: {
        AccountCode: `${coreData?.entityIds?.relatedEntityTypeId}`
      },
      EntityType: customConfig?.ActivityEvent,
      ActivityId: customConfig?.CompanyActivityId,
      AccountId: customConfig?.RelatedCompanyId ?? action?.id,
      AccountActivityCode: customConfig?.ActivityEvent,
      AccountActivityId: customConfig?.CompanyActivityId,
      AssociatedEntity: 0
    }
  };

  return generateFormConfig({ action, config: accountAddLeadFormConfig });
}
export async function generateAccountActivityAddActivityFormConfig({
  action,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const config: IFormsConfiguration = {
    Config: {
      Name: action.title,
      Entity: DefaultFormEntity.ACCOUNTACTIVITY,
      Type: ProcessType.ADDNEW,
      IsDefaultForm: true,
      RelatedEntityType: {
        AccountCode: customConfig?.relatedEntityCode ?? ''
      },
      EntityType: customConfig?.EntityType,
      AccountActivityCode: customConfig?.EntityType
    }
  };

  return generateFormConfig({ action, config });
}

export async function generateAccountAddNewLeadActivityFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const accountAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 2,
      Type: 0,
      IsDefaultForm: true,
      AccountId: action?.entityId
    }
  };

  return generateFormConfig({ action, config: accountAddLeadFormConfig });
}

export async function generateQuickAddLeadFormConfig({
  action,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const leadType = coreData?.leadType;
  const quickAddLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title,
      Entity: 0,
      Type: 2,
      IsDefaultForm: true
    }
  };
  if (leadType) {
    quickAddLeadFormConfig.Config.EntityType = leadType;
  }
  return generateFormConfig({ action, config: quickAddLeadFormConfig });
}

export async function generateAddNewLeadFormConfig({
  action,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const leadType = coreData?.leadType;
  const addLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 0,
      Type: 0,
      IsDefaultForm: true
    }
  };
  if (leadType) {
    addLeadFormConfig.Config.EntityType = leadType;
  }
  return generateFormConfig({ action, config: addLeadFormConfig });
}

export async function generateAccountFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const addLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 5,
      Type: 2,
      EntityType: action?.entityTypeId,
      IsDefaultForm: true
    }
  };
  return generateFormConfig({ action, config: addLeadFormConfig });
}

export async function generateAccountEditFormConfig({
  action,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const editAccountFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 5,
      Type: 0,
      IsDefaultForm: true,
      AccountId: customConfig?.CompanyId ?? getAccountId(),
      EntityType: customConfig?.entityCode ?? getAccountTypeId(),
      LeadId: getAccountId()
    }
  };
  return generateFormConfig({ action, config: editAccountFormConfig });
}

export async function generateQuickAddActivityFormConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const quickAddActivityFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 2,
      Type: 0,
      IsDefaultForm: true,
      EntityType: action?.entityTypeId
    }
  };
  return generateFormConfig({ action, config: quickAddActivityFormConfig });
}

export async function generateOpportunityDetailEditVCardFormConfig({
  action,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  let leadId = '';
  let oppId = '';
  let oppEventCode = '';

  if (coreData) {
    const { entityIds, eventCode } = coreData;
    leadId = entityIds?.lead || '';
    oppId = entityIds?.opportunity || '';
    oppEventCode = eventCode ? `${eventCode}` : '';
  }
  const oppFormConfig: IFormsConfiguration = {
    Config: {
      LeadId: leadId,
      OpportunityId: oppId,
      IsDefaultForm: true,
      Name: action?.formTitle || action.title || action?.toolTip,
      Type: 1,
      Entity: 1,
      EntityType: oppEventCode
    }
  };

  return generateFormConfig({ action, config: oppFormConfig, coreData });
}

export async function generateOpportunityAddActivityFormConfig({
  action,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  let leadId = '';
  let oppId = '';

  if (coreData) {
    const { entityIds } = coreData;
    leadId = entityIds?.lead || '';
    oppId = entityIds?.opportunity || '';
  }
  const oppFormConfig: IFormsConfiguration = {
    Config: {
      LeadId: leadId,
      OpportunityId: oppId,
      IsDefaultForm: true,
      Name: 'Add Activity',
      Type: 0,
      Entity: 2,
      AssociatedEntity: 1
    }
  };

  return generateFormConfig({ action, config: oppFormConfig, coreData });
}

export async function generateOpportunityAddTaskFormConfig({
  action,
  coreData,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  let leadId = '';
  let oppId = '';

  const getAddTaskFormTitle = (): string => {
    if (customConfig?.oppTypeName) {
      return `Add Tasks to ${customConfig?.oppTypeName || 'Opportunity'}`;
    }
    return 'Add Task';
  };

  if (coreData) {
    const { entityIds } = coreData;
    leadId = entityIds?.lead || '';
    oppId = entityIds?.opportunity || '';
  }
  const oppFormConfig: IFormsConfiguration = {
    Config: {
      LeadId: leadId,
      OpportunityId: oppId,
      IsDefaultForm: true,
      Name: getAddTaskFormTitle(),
      Type: 0,
      Entity: 3,
      AssociatedEntity: 1
    }
  };

  return generateFormConfig({ action, config: oppFormConfig, coreData });
}

export async function generateOpportunityEditTaskFormConfig({
  action,
  coreData,
  customConfig
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  let leadId = '';
  let oppId = '';

  if (coreData) {
    const { entityIds } = coreData;
    leadId = entityIds?.lead || '';
    oppId = entityIds?.opportunity || '';
  }
  const oppFormConfig: IFormsConfiguration = {
    Config: {
      LeadId: leadId,
      OpportunityId: oppId,
      IsDefaultForm: true,
      Name: customConfig?.Name,
      Type: 0,
      Entity: 3,
      TaskId: customConfig?.TaskId,
      EntityType: customConfig?.EntityType
    }
  };

  return generateFormConfig({ action, config: oppFormConfig, coreData, customConfig });
}

export async function generateOpportunityDetailEditFormConfig({
  action,
  coreData
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  let leadId = '';
  let oppId = '';
  let oppEventCode = '';

  if (coreData) {
    const { entityIds, eventCode } = coreData;
    leadId = entityIds?.lead || '';
    oppId = entityIds?.opportunity || '';
    oppEventCode = `${eventCode ?? entityIds?.EntityTypeId ?? ''}`;
  }
  const oppFormConfig: IFormsConfiguration = {
    Config: {
      LeadId: leadId,
      OpportunityId: oppId,
      IsDefaultForm: true,
      Name: action?.formTitle || action.title || action?.toolTip,
      Type: 0,
      Entity: 1,
      EntityType: oppEventCode
    }
  };

  return generateFormConfig({ action, config: oppFormConfig, coreData });
}

export async function generateAddOpportunityConfig({
  action
}: IGenerateLeadEdotFormConfig): Promise<IFormsConfiguration | null> {
  const addLeadFormConfig: IFormsConfiguration = {
    Config: {
      Name: action.title || action?.toolTip,
      Entity: 1,
      Type: 0,
      EntityType: action?.entityTypeId,
      IsDefaultForm: true
    }
  };
  return generateFormConfig({ action, config: addLeadFormConfig });
}
