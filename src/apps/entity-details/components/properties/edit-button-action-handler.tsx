import { IFormsConfiguration } from 'apps/forms/forms.types';
import { ICallActionClickHandlers } from '../vcard/actions/button-actions/button-actions.types';

import { getEntityId } from 'common/utils/helpers';
import { workAreaIds } from 'common/utils/process';
import {
  DefaultFormEntity,
  IEntityDetailsCoreData,
  IEntityRepresentationName,
  ProcessType
} from '../../types/entity-data.types';
import { EntityType } from 'common/types';
import { IGenericActionBtnClickConfig } from '../vcard/actions/button-actions/button-actions.types';
import { StorageKey, getItem } from 'common/utils/storage-manager';
import { getAccountId, getAccountTypeId, getOpportunityId } from 'common/utils/helpers/helpers';
import { handleProcessFormConfigGenerationForAction } from '../vcard/actions/button-actions/entity-button-action-handler';
import { getLeadType } from '../../entitydetail.store';

interface IGenerateEditFormConfig extends IGenericActionBtnClickConfig {
  type: EntityType;
  entityDetailsCoreData: IEntityDetailsCoreData;
  oppTitle?: string;
  formTitle?: string;
  isAssociatedEntity?: boolean;
}

export async function generateEditFormConfig({
  action,
  type,
  entityDetailsCoreData,
  formTitle,
  isAssociatedEntity
}: IGenerateEditFormConfig): Promise<IFormsConfiguration | null | undefined> {
  const getLeadId = (): string => {
    return getEntityId() || entityDetailsCoreData?.entityIds?.lead;
  };

  const getLeadFormTitle = (): string => formTitle || 'Edit Properties';
  const getOpportunityFormTitle = (): string => formTitle || `Edit Opportunity`;

  const leadId = getLeadId();
  const accountId = getAccountId();

  let editFormConfig: IFormsConfiguration = {
    Config: {}
  };

  const getLeadEditFormConfig = (): IFormsConfiguration => {
    const leadEditFormConfig: IFormsConfiguration = {
      Config: {
        Name: getLeadFormTitle(),
        Entity: DefaultFormEntity[type.toUpperCase()] as DefaultFormEntity,
        Type: ProcessType.VCARD,
        IsDefaultForm: true,
        LeadId: leadId,
        EntityType: getLeadType()
      }
    };
    if (isAssociatedEntity) {
      leadEditFormConfig.Config.Type = 4;
      leadEditFormConfig.Config.EntityType = `${entityDetailsCoreData?.eventCode}`;
    }
    return leadEditFormConfig;
  };

  if (type === EntityType.Lead) {
    editFormConfig = getLeadEditFormConfig();
  } else if (type === EntityType.Account) {
    const representationName = getItem(
      StorageKey.AccountRepresentationName
    ) as IEntityRepresentationName;

    editFormConfig = {
      Config: {
        Name: `Edit ${representationName?.SingularName || 'Account'}`,
        Entity: DefaultFormEntity[type.toUpperCase()] as DefaultFormEntity,
        Type: ProcessType.VCARDPROPERTIES,
        IsDefaultForm: true,
        AccountId: accountId,
        EntityType: getAccountTypeId()
      }
    };
  } else if (type === EntityType.Opportunity) {
    const opportunityId = getOpportunityId();

    editFormConfig = {
      Config: {
        Name: getOpportunityFormTitle(),
        Entity: DefaultFormEntity[type.toUpperCase()] as DefaultFormEntity,
        Type: ProcessType.VCARDPROPERTIES,
        IsDefaultForm: true,
        OpportunityId: opportunityId,
        EntityType: `${entityDetailsCoreData?.eventCode}`,
        LeadId: leadId
      }
    };

    if (action?.workAreaConfig) {
      const formsConfig = await handleProcessFormConfigGenerationForAction({
        action,
        defaultFormConfigGenerator: () => editFormConfig,
        coreData: entityDetailsCoreData
      });
      return formsConfig;
    }
  }

  if (action?.workAreaConfig?.workAreaId === workAreaIds.NA) {
    return editFormConfig;
  }
}

interface IInvoke extends ICallActionClickHandlers {
  type: EntityType;
  entityDetailsCoreData: IEntityDetailsCoreData;
  formTitle?: string;
  isAssociatedEntity?: boolean;
}

async function getFormConfig({
  action,
  onSuccess,
  onShowFormChange,
  type,
  entityDetailsCoreData,
  formTitle,
  isAssociatedEntity
}: IInvoke): Promise<IFormsConfiguration | null> {
  const formConfig = await generateEditFormConfig({
    action,
    type,
    entityDetailsCoreData,
    formTitle,
    isAssociatedEntity
  });
  if (!formConfig) return null;

  return {
    ...formConfig,
    OnSuccess: onSuccess,
    OnShowFormChange: onShowFormChange
  };
}

export { getFormConfig };
