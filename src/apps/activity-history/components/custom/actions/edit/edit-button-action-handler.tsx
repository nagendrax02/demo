/* eslint-disable complexity */
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import {
  ICallActionClickHandlers,
  IGenericActionBtnClickConfig
} from 'apps/entity-details/components/vcard/actions/button-actions/button-actions.types';
import { IFormsConfiguration } from 'apps/forms/forms.types';
import { getEntityId } from 'common/utils/helpers';
import { workAreaIds } from 'common/utils/process';
import { OPPORTUNITY_ENTITY_CODE } from 'common/constants';
import {
  DefaultFormEntity,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { ISelectedLeadFilterOption } from '../../../filters/account-lead-filter/accountLeadFilter.types';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { getAccountTypeId } from 'common/utils/helpers/helpers';

interface IGenerateEditFormConfig extends IGenericActionBtnClickConfig {
  data: IAugmentedAHDetail;
  type?: EntityType;
  accountLeadSelectedOption?: ISelectedLeadFilterOption[];
  entityIds: IEntityIds | undefined;
}

const getOppId = (data: IAugmentedAHDetail): string => {
  if (data?.ActivityEvent && data?.ActivityEvent >= OPPORTUNITY_ENTITY_CODE) return data?.Id || '';
  return data?.AdditionalDetails?.RelatedActivityId || '';
};

const getActId = (data: IAugmentedAHDetail, entityIds?: IEntityIds): string => {
  if (data?.ActivityEvent && data?.ActivityEvent < OPPORTUNITY_ENTITY_CODE) return data?.Id || '';
  else if (entityIds?.account) {
    return data?.CompanyActivityId || '';
  }
  return '';
};

const getEntity = (data: IAugmentedAHDetail, entityIds?: IEntityIds, type?: EntityType): number => {
  if (data?.ActivityEvent && data?.ActivityEvent < OPPORTUNITY_ENTITY_CODE) {
    return DefaultFormEntity.ACTIVITY;
  } else if (entityIds?.account && type === EntityType.Account) {
    return DefaultFormEntity.ACCOUNTACTIVITY;
  } else return DefaultFormEntity.OPPORTUNITY;
};

const getName = (data: IAugmentedAHDetail): string => {
  if (data?.ActivityEvent && data?.ActivityEvent < OPPORTUNITY_ENTITY_CODE)
    return data?.ActivityName || '';
  return data?.AdditionalDetails?.OpportunityName || '';
};

export async function generateEditFormConfig({
  data,
  action,
  type,
  accountLeadSelectedOption,
  entityIds
}: IGenerateEditFormConfig): Promise<IFormsConfiguration | null | undefined> {
  const leadId = getEntityId();

  let editFormConfig: IFormsConfiguration = {
    Config: {}
  };

  if (entityIds?.account && type === EntityType.Account) {
    editFormConfig = {
      Config: {
        Name: getName(data),
        Entity: 6,
        Type: 0,
        EntityType: `${data?.ActivityEvent}`,
        ActivityId: data?.CompanyActivityId,
        AccountActivityCode: `${data?.ActivityEvent}`,
        IsDefaultForm: true,
        AccountId: entityIds?.account || '',
        AccountActivityId: `${data?.CompanyActivityId || ''}`,
        AssociatedEntity: 0,
        RelatedEntityType: { AccountCode: entityIds?.EntityTypeId || getAccountTypeId() }
      }
    };
  } else if (entityIds?.account && type === EntityType.Lead) {
    editFormConfig = {
      Config: {
        Name: getName(data),
        Entity: getEntity(data, entityIds, type),
        Type: 0,
        EntityType: `${data?.ActivityEvent}`,
        ActivityId: getActId(data, entityIds),
        AccountActivityCode: `${data?.ActivityEvent}`,
        IsDefaultForm: true,
        LeadId: accountLeadSelectedOption?.[0]?.value,
        OpportunityId: data?.Id
      }
    };
  } else if (entityIds?.opportunity) {
    editFormConfig = {
      Config: {
        Name: getName(data),
        Type: 0,
        EntityType: `${data?.ActivityEvent}`,
        ActivityId: getActId(data, entityIds),
        AccountActivityCode: `${data?.ActivityEvent}`,
        IsDefaultForm: true,
        AccountId: entityIds?.account || '',
        AccountActivityId: `${data?.CompanyActivityId || ''}`,
        LeadId: entityIds?.lead,
        OpportunityId: entityIds?.opportunity,
        Entity: 2,
        AssociatedEntity: 0
      }
    };
  } else {
    editFormConfig = {
      Config: {
        Name: getName(data),
        Entity: getEntity(data),
        Type: 0,
        EntityType: `${data?.ActivityEvent}`,
        ActivityId: getActId(data),
        AccountActivityCode: `${data?.ActivityEvent}`,
        IsDefaultForm: true,
        LeadId: leadId,
        OpportunityId: getOppId(data)
      }
    };
  }

  if (
    action?.workAreaConfig?.workAreaId === workAreaIds.LEAD_DETAILS.EDIT_ACTIVITY ||
    action?.workAreaConfig?.workAreaId === workAreaIds.OPPORTUNITY_DETAILS.EDIT_ACTIVITY ||
    (entityIds?.account && action?.workAreaConfig?.workAreaId === workAreaIds.NA) // this condition is for account since we can't configure process hence the workArea id is -1
  ) {
    return editFormConfig;
  }
}

interface IEditCallActionClickHandlers extends ICallActionClickHandlers {
  data: IAugmentedAHDetail;
  type?: EntityType;
  accountLeadSelectedOption?: ISelectedLeadFilterOption[];
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

async function getFormConfig({
  action,
  data,
  onSuccess,
  onShowFormChange,
  type,
  accountLeadSelectedOption,
  entityDetailsCoreData
}: IEditCallActionClickHandlers): Promise<IFormsConfiguration | null> {
  const { entityIds } = entityDetailsCoreData || {};

  const formConfig = await generateEditFormConfig({
    data,
    action,
    type,
    accountLeadSelectedOption,
    entityIds
  });

  if (!formConfig) return null;

  return { ...formConfig, OnSuccess: onSuccess, OnShowFormChange: onShowFormChange };
}

export { getFormConfig };
