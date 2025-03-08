import { trackError } from 'common/utils/experience/utils/track-error';
import { IActionConfiguration, IConnectorConfiguration, ILead } from 'common/types/entity/lead';
import { ActionRenderType } from 'apps/entity-details/types/action.types';
import { CUSTOM_ACTIONS, ACTION } from 'apps/entity-details/constants';
import {
  IActionMenuItem,
  IAugmentedAction,
  IButtonAction,
  ISegregatedActions
} from 'apps/entity-details/types/entity-data.types';
import { getCustomActions, handleConnectorActions } from './custom-action';

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
    id: action?.Name,
    title: action?.Title,
    type: action?.Type as ActionRenderType,
    sequence: action?.Sequence,
    renderAsIcon: action?.RenderAsIcon,
    actionHandler: {}
  };
};

const handleActionsSorting = (actions: IButtonAction[]): void => {
  actions?.sort((actionOne, actionSecond) =>
    (actionOne?.sequence || 0) > (actionSecond?.sequence || 0) ? 1 : -1
  );
};

export const getMoreOptionMenu = (actions: IButtonAction[]): IActionMenuItem[] => {
  return (
    actions?.map((action) => ({
      ...action,
      label: action?.title,
      value: action?.value || '',
      isLoading: action?.isLoading,
      subMenu: action?.subMenu,
      disabled: action?.disabled,
      toolTip: action?.toolTip,
      workAreaConfig: action?.workAreaConfig
    })) || []
  );
};

const getCustomActionConfig = (customActions: IButtonAction[]): IActionMenuItem[] => {
  return customActions?.length > 1
    ? [getCustomActions(customActions)]
    : getMoreOptionMenu([customActions[0]]);
};

const getConnectorActions = (
  actionName: string,
  connectorActions: IButtonAction[]
): IActionMenuItem => {
  return {
    label: actionName,
    value: actionName,
    subMenu: getMoreOptionMenu(connectorActions)
  } as IActionMenuItem;
};

const getConnectorActionConfig = (connectorActions: IButtonAction[]): IActionMenuItem[] => {
  const connectorActionMap: Record<string, IButtonAction[]> = connectorActions.reduce(
    (actionMap: Record<string, IButtonAction[]>, action) => {
      if (action.connectorConfig) {
        actionMap[action.connectorConfig.Category] =
          actionMap[action.connectorConfig.Category] || [];

        actionMap[action.connectorConfig.Category].push(action);
      }
      return actionMap;
    },
    {}
  );
  const actionMenu: IActionMenuItem[] = [];
  Object.keys(connectorActionMap).forEach((category) => {
    actionMenu.push(
      connectorActionMap[category].length > 1
        ? getConnectorActions(category, connectorActionMap[category])
        : getMoreOptionMenu(connectorActionMap[category])[0]
    );
  });
  return actionMenu;
};

const isConnectorAction = (action: IButtonAction): boolean => {
  return (
    (action?.connectorConfig &&
      action?.connectorConfig.Config.IsEnabled &&
      action?.connectorConfig.ShowInWeb) ??
    false
  );
};

// eslint-disable-next-line max-lines-per-function
export const handleActionSegregation = (
  actions: IButtonAction[],
  loadingActions?: string[],
  buttonActionsLimit?: number
): ISegregatedActions => {
  const customActions = [] as IButtonAction[];
  const buttonActions = [] as IButtonAction[];
  const moreActions = [] as IActionMenuItem[];
  const connectorActions = [] as IButtonAction[];

  actions?.forEach((actionConfig) => {
    const action = { ...(actionConfig || {}) };

    if (loadingActions?.includes(action?.id)) {
      action.isLoading = true;
    }
    if (action.type === ActionRenderType.Button) {
      buttonActions.push(action);
    } else if (action.type === ActionRenderType.Dropdown) {
      if (action?.connectorConfig?.Category === CUSTOM_ACTIONS) {
        customActions.push(action);
        return;
      }
      if (isConnectorAction(action)) {
        connectorActions.push(action);
        return;
      }

      moreActions.push(...getMoreOptionMenu([action]));
    }
  });

  if (buttonActionsLimit && buttonActions.length > buttonActionsLimit) {
    const excessButtonActions = buttonActions.slice(buttonActionsLimit);

    buttonActions.length = buttonActionsLimit;

    const excessMenuItems = getMoreOptionMenu(excessButtonActions);

    moreActions.unshift(...excessMenuItems);
  }

  if (customActions?.length) {
    const customActionsMenu = getCustomActionConfig(customActions);
    moreActions.push(...customActionsMenu);
  }
  if (connectorActions?.length) {
    const connectorActionsMenu = getConnectorActionConfig(connectorActions);
    moreActions.push(...connectorActionsMenu);
  }
  return { buttonActions, moreActions };
};

export const getActionConfig = (
  actionConfig: IActionConfiguration[],
  connectorConfig: IConnectorConfiguration,
  fields: Record<string, string | null>
): IButtonAction[] => {
  const augmentedActions = [] as IButtonAction[];
  try {
    actionConfig?.forEach((action) => {
      let config: IButtonAction | null = null;

      if (action?.IsConnectorAction) {
        config = handleConnectorActions(connectorConfig, action);
      } else {
        config = handleActionAugmentation(action, fields);
      }

      if (config) {
        augmentedActions?.push(config);
      }
    });

    handleActionsSorting(augmentedActions);
  } catch (error) {
    trackError(error);
  }

  return augmentedActions;
};

const getAugmentedActions = (entityData: ILead): IAugmentedAction => {
  const actions = getActionConfig(
    entityData?.details?.ActionsConfiguration,
    entityData?.details?.ConnectorConfiguration,
    entityData?.details?.Fields
  );
  return { actions, settingConfig: entityData?.details?.SettingConfiguration };
};

export { getAugmentedActions };
