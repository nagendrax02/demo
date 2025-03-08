import { entityAttributeEditAction, IEditActionConfig } from '../../constants';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { getProcessActionConfig } from 'common/utils/process';
import { ACTION } from '../../../entity-details/constants';
import { getLeadType } from 'apps/entity-details/entitydetail.store';

export const getEntityAttributeEditActionConfig = (
  tabId: string,
  eventCode?: string
): IEditActionConfig => {
  const config = entityAttributeEditAction[tabId];
  if (config?.id === ACTION.OpportunityAttributeDetailsEdit) {
    config.workAreaConfig.additionalData = eventCode;
  }
  if (config?.id === ACTION.LeadAttributeDetailsEdit && getLeadType()) {
    return {
      ...config,
      workAreaConfig: {
        ...config.workAreaConfig,
        additionalData: getLeadType()
      }
    };
  }
  return config;
};

export const getConvertedEditButton = ({
  processFormsData,
  tabId,
  isLoading,
  eventCode
}: {
  processFormsData: IProcessFormsData | null;
  tabId: string;
  isLoading: boolean;
  eventCode?: string;
}): IActionWrapperItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    getEntityAttributeEditActionConfig(tabId, eventCode),
    processFormsData || {}
  );
  const hasOneForm = totalForms === 1;
  return {
    ...convertedAction,
    title: hasOneForm ? firstFormName : convertedAction?.title,
    isLoading: isLoading,
    subMenu: hasOneForm ? [] : convertedAction?.subMenu
  };
};
