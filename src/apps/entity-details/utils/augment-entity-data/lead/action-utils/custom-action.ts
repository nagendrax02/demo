import { CUSTOM_ACTIONS } from 'apps/entity-details/constants';
import { IActionConfig, ActionRenderType } from 'apps/entity-details/types';
import { IActionMenuItem } from 'src/apps/entity-details/types/entity-data.types';
import { IConnectorConfiguration, IActionConfiguration } from 'common/types/entity/lead';
import { getMoreOptionMenu } from './action';

const handleConnectorActions = (
  connectorConfig: IConnectorConfiguration,
  action: IActionConfiguration
): IActionConfig | null => {
  const connectorActionConfig = connectorConfig?.[action?.ConnectorCategory]?.find(
    (connectorAction) => connectorAction?.Id === action?.Name
  );
  if (!connectorActionConfig) return null;

  if (action?.Type === ActionRenderType.Button) {
    return {
      id: connectorActionConfig?.Id,
      title: action?.Title,
      type: action?.Type,
      sequence: action?.Sequence,
      connectorConfig: connectorActionConfig,
      actionHandler: {}
    };
  } else if (action?.Type === ActionRenderType.Dropdown) {
    return {
      id: connectorActionConfig?.Id,
      title: connectorActionConfig?.Config?.DisplayText,
      type: action?.Type,
      sequence: action?.Sequence,
      connectorConfig: connectorActionConfig,
      actionHandler: {}
    };
  }
  return null;
};

const getCustomActions = (customActions: IActionConfig[]): IActionMenuItem => {
  return {
    label: CUSTOM_ACTIONS,
    value: CUSTOM_ACTIONS,
    subMenu: getMoreOptionMenu(customActions)
  } as IActionMenuItem;
};

export { handleConnectorActions, getCustomActions };
