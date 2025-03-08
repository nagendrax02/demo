import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { getProcessActionConfig } from 'common/utils/process';
import { LEAD_REP_NAME, QUICK_ADD_OPTIONS } from '../../constants';
import {
  IActionMenuItem,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';

const getProcessId = (processFormsData: IProcessFormsData, workAreaId: number): string => {
  const processId = processFormsData[workAreaId]?.ActionOutputs?.[0]?.ProcessId ?? '';
  return processId;
};

export const getConvertedActions = (
  actions: IMenuItem[],
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IMenuItem[] => {
  return actions.map((action) => {
    const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
      action,
      processFormsData
    );
    const hasSingleForm = totalForms === 1;
    return {
      ...convertedAction,
      subMenu: hasSingleForm ? [] : convertedAction?.subMenu,
      isLoading: isLoading,
      label: hasSingleForm ? (firstFormName as string) : action?.label,
      value:
        hasSingleForm && processFormsData
          ? getProcessId(processFormsData, action.workAreaConfig?.workAreaId as number)
          : action?.value
    };
  });
};

export const getAugmentedAction = (leadRepName: IEntityRepresentationName): IActionMenuItem[] => {
  return QUICK_ADD_OPTIONS?.map((action) => {
    return {
      ...action,
      title: action?.title?.replace(LEAD_REP_NAME, leadRepName?.SingularName || 'Lead'),
      label: action?.label?.replace(LEAD_REP_NAME, leadRepName?.SingularName || 'Lead'),
      toolTip: action?.toolTip?.replace(LEAD_REP_NAME, leadRepName?.SingularName || 'Lead')
    };
  });
};
