import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { ActionRenderType } from 'apps/entity-details/types';
import { IProcessFormsData } from 'common/utils/process/process.types';
import { getProcessActionConfig } from 'common/utils/process';

export const getConvertedAction = (
  workAreaId: number,
  processFormsData: IProcessFormsData | null,
  isLoading: boolean
): IActionMenuItem => {
  const { convertedAction, firstFormName, totalForms } = getProcessActionConfig(
    { workAreaConfig: { workAreaId } },
    processFormsData
  );
  const hasSingleForm = totalForms === 1;
  return {
    ...convertedAction,
    toolTip: hasSingleForm ? firstFormName : '',
    title: hasSingleForm ? firstFormName : '',
    isLoading: isLoading,
    id: 'id',
    type: ActionRenderType.Button,
    sequence: 0,
    subMenu: convertedAction?.subMenu || [],
    label: '',
    value: '',
    actionHandler: {}
  };
};
