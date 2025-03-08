import { workAreaIds } from 'common/utils/process';
import { ACTION } from 'apps/entity-details/constants';
import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';

export interface IEditActionConfig {
  title: string;
  id: string;
  workAreaConfig: {
    workAreaId: number;
    additionalData?: string;
  };
}

export const LEAD_ATTRIBUTE_EDIT_ACTION = {
  title: 'Edit',
  id: ACTION.LeadAttributeDetailsEdit,
  workAreaConfig: { workAreaId: workAreaIds.LEAD_DETAILS.EDIT_LEAD_DETAILS }
};

export const ACCOUNT_ATTRIBUTE_EDIT_ACTION = {
  title: 'Edit',
  id: ACTION.AccountAttributeDetailsEdit,
  workAreaConfig: { workAreaId: workAreaIds.NA }
};

export const OPPORTUNITY_ATTRIBUTE_EDIT_ACTION = {
  title: 'Edit',
  id: ACTION.OpportunityAttributeDetailsEdit,
  workAreaConfig: { workAreaId: workAreaIds.OPPORTUNITY_DETAILS.EDIT_OPPORTUNITY_DETAILS }
};

export const entityAttributeEditAction: Record<string, IEditActionConfig> = {
  [TAB_ID.LeadAttributeDetails]: LEAD_ATTRIBUTE_EDIT_ACTION,
  [TAB_ID.AccountDetails]: ACCOUNT_ATTRIBUTE_EDIT_ACTION,
  [TAB_ID.ActivityDetails]: OPPORTUNITY_ATTRIBUTE_EDIT_ACTION
};
