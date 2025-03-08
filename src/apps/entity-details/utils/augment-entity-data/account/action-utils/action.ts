import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import {
  IActionMenuItem,
  IAugmentedAction,
  IButtonAction,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { IAccount } from 'common/types';
import { IActionConfiguration } from 'common/types/entity/account/details.types';
import { ACTION, PRIMARY_ACTION } from 'apps/entity-details/constants';
import { ActionRenderType } from 'apps/entity-details/types';
import { workAreaIds } from 'src/common/utils/process';

interface IGetActionConfig {
  actionConfig: IActionConfiguration[];
  fields: Record<string, string | null>;
  leadRepresentationName: IEntityRepresentationName | undefined;
  accountRepresentationName: IEntityRepresentationName | undefined;
}

const canIncludeAction = (
  action: IActionConfiguration,
  fields: Record<string, string | null>
): boolean => {
  if (!ACTION[action?.Name]) return false;

  if (action?.RenderAsIcon) {
    return false;
  }

  if (action?.Name === ACTION.SetAsPrimaryContact && !fields?.RelatedCompanyId) {
    return false;
  }

  return true;
};

const handleActionAugmentation = (
  action: IActionConfiguration,
  fields: Record<string, string | null>
): IButtonAction | null => {
  if (!canIncludeAction(action, fields)) return null;

  return {
    id: action?.Name === 'Edit' ? ACTION.AccountEdit : action?.Name,
    title: action?.Title,
    type: action?.Type as ActionRenderType,
    sequence: action?.Sequence,
    renderAsIcon: action?.RenderAsIcon
  };
};

const handleActionsSorting = (actions: IButtonAction[]): void => {
  actions?.sort((actionOne, actionSecond) =>
    (actionOne?.sequence || 0) > (actionSecond?.sequence || 0) ? 1 : -1
  );
};

const isPrimaryAction = (actionName: string): boolean => {
  return (
    actionName === PRIMARY_ACTION.ACTIVITY ||
    actionName === PRIMARY_ACTION.NOTE ||
    actionName === PRIMARY_ACTION.OPPORTUNITY ||
    actionName === PRIMARY_ACTION.TASKS ||
    actionName === PRIMARY_ACTION.PROCESSES ||
    actionName === PRIMARY_ACTION.ASSIGN_LEADS ||
    actionName === PRIMARY_ACTION.ADD_LEAD
  );
};

const getLabel = (
  action: IActionConfiguration,
  leadRepresentationName: IEntityRepresentationName | undefined
): string => {
  if (action?.Name === 'Assign_Leads') {
    return `Assign ${leadRepresentationName?.SingularName}`;
  } else if (action?.Name === 'Add_Lead') {
    return `Add ${leadRepresentationName?.SingularName}`;
  }
  return action?.Name;
};

export const getActionConfig = (props: IGetActionConfig): IButtonAction[] => {
  const { actionConfig, fields, leadRepresentationName, accountRepresentationName } = props;
  let augmentedActions = [] as IButtonAction[];

  const primaryOption: IActionMenuItem[] = [];

  try {
    actionConfig?.forEach((action) => {
      let config: IButtonAction | null = null;

      config = handleActionAugmentation(action, fields);

      if (action.Type === ActionRenderType.Button && isPrimaryAction(action.Name)) {
        if (action?.Name === 'Activity') {
          primaryOption.push({
            id: action.Title,
            title: action.Title,
            value: action.Name,
            sequence: action?.Sequence,
            label: 'Activity',
            subMenu: [
              {
                label: `${accountRepresentationName?.SingularName} Activity`,
                value: 'Account_Activity'
              },
              { label: 'Lead Activity', value: 'Lead_Activity' }
            ]
          });
        } else {
          primaryOption.push({
            id: action.Title,
            title: action.Title,
            value: action.Name,
            sequence: action?.Sequence,
            label: getLabel(action, leadRepresentationName),
            workAreaConfig: {
              workAreaId: workAreaIds.NA
            }
          });
        }
      } else if (config) {
        augmentedActions?.push(config);
      }
    });

    if (primaryOption.length) {
      augmentedActions = [
        {
          id: 'Add',
          title: 'ADD',
          renderAsIcon: true,
          type: ActionRenderType.Button,
          sequence: primaryOption.length > 1 ? 0 : primaryOption[0]?.sequence,
          subMenu: primaryOption
        },
        ...augmentedActions
      ];
    }

    handleActionsSorting(augmentedActions);
  } catch (error) {
    trackError(error);
  }

  return augmentedActions;
};

const getAugmentedActions = (entityData: IAccount): IAugmentedAction => {
  const actions = getActionConfig({
    actionConfig: entityData?.details?.ActionsConfiguration,
    fields: entityData?.details?.Fields,
    leadRepresentationName: entityData?.metaData?.LeadRepresentationConfig,
    accountRepresentationName: entityData?.metaData?.AccountRepresentationConfig
  });

  return { actions };
};

export { getAugmentedActions };
