import { trackError } from 'common/utils/experience/utils/track-error';
import {
  ConnectorConfiguration,
  IActionsConfiguration
} from 'common/types/entity/opportunity/detail.types';
import { IButtonAction } from '../../../../types/entity-data.types';
import { handleConnectorActions } from './custom-action-utils';
import { ActionRenderType } from '../../../../types';
import { ACTION } from '../../../../constants';

const validTaskActionNames = ['Tasks', 'Task'];
const validChangeStatusActionNames = ['ChangeStageStatus', 'Change_Status_Stage'];

const canIncludeAction = (action: IActionsConfiguration): boolean => {
  if (validTaskActionNames?.includes(action?.Name)) {
    return true;
  }
  if (validChangeStatusActionNames?.includes(action?.Name)) {
    return true;
  }
  if (!ACTION[action?.Name]) return false;

  if (action?.RenderAsIcon) {
    return false;
  }

  return true;
};

const getAugmentedActionName = (action: IActionsConfiguration): string => {
  if (validTaskActionNames?.includes(action?.Name)) {
    return ACTION.Tasks;
  }
  if (validChangeStatusActionNames?.includes(action?.Name)) {
    return ACTION.Change_Status_Stage;
  }
  return action?.Name;
};

const handleActionAugmentation = (action: IActionsConfiguration): IButtonAction | null => {
  if (!canIncludeAction(action)) return null;

  const actionName = getAugmentedActionName(action);

  return {
    id: actionName,
    title: action?.Title,
    type: action?.Type as ActionRenderType,
    sequence: action?.Sequence,
    renderAsIcon: action?.RenderAsIcon,
    actionHandler: {}
  };
};

export const getActionConfig = (
  actionConfig: IActionsConfiguration[],
  connectorConfig: ConnectorConfiguration
): IButtonAction[] => {
  const augmentedActions = [] as IButtonAction[];
  try {
    actionConfig?.forEach((action) => {
      let config: IButtonAction | null = null;

      if (action?.IsConnectorAction) {
        config = handleConnectorActions(connectorConfig, action);
      } else {
        config = handleActionAugmentation(action);
      }

      if (config) {
        augmentedActions?.push(config);
      }
    });
  } catch (error) {
    trackError(error);
  }

  return augmentedActions;
};
