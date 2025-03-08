import { IActionConfig } from 'apps/entity-details/types';
import { ISvActionConfig, IUserPermission } from 'src/apps/smart-views/smartviews.types';
import { actionKeys } from 'src/apps/smart-views/augment-tab-data/opportunity/constants';
import { updateRowAction } from 'src/apps/smart-views/augment-tab-data/opportunity/helpers';

export const actionsReducer = ({
  actions,
  canDelete,
  userPermissions
}: {
  actions: IActionConfig[];
  actionConfig?: ISvActionConfig;
  canDelete?: boolean;
  userPermissions?: IUserPermission;
}): IActionConfig[] => {
  const quickActions: IActionConfig[] = [];

  actions.forEach((action) => {
    action = updateRowAction({
      action: action,
      disableDelete: !userPermissions?.delete,
      disableUpdate: !userPermissions?.update
    });

    if (action.key) {
      if (action.key === actionKeys.delete && !canDelete) {
        action.disabled = true;
        action.toolTip = 'Delete disabled for this activity';
      }

      quickActions.push({
        ...action,
        value: action.key,
        label: action.title
      });
    }
  });

  return quickActions;
};
