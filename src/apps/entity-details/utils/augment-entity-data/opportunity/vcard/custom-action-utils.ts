import {
  ConnectorConfiguration,
  IActionsConfiguration
} from 'common/types/entity/opportunity/detail.types';
import { ActionRenderType, IActionConfig } from '../../../../types';

const handleConnectorActions = (
  connectorConfig: ConnectorConfiguration,
  action: IActionsConfiguration
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

export { handleConnectorActions };
