import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { SelectColumn } from 'apps/smart-views/constants/constants';
import { IActionConfig } from 'apps/entity-details/types';
import { ACTION } from 'apps/entity-details/constants';
import { workAreaIds } from 'common/utils/process/constant';
import { handleDeleteActivity } from 'apps/smart-views/augment-tab-data/activity/helpers';
import { Variant } from 'common/types';

export const MANAGE_ACTIVITY_FEATURE_RESTRICTION_MAP: Record<string, string> = {
  [SelectColumn]:
    FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageActivities].SelectColumn
};

export const DEFAULT_SORT_ON = 'ModifiedOn-desc';
export const EntityCode = 'ec';
export const actionKeys = {
  edit: '101',
  cancel: '102',
  delete: '103'
};

const getEditAction = (entityCode?: string): IActionConfig => ({
  key: actionKeys.edit,
  id: ACTION.EditActivity,
  title: 'Edit',
  toolTip: 'Edit',
  workAreaConfig: {
    workAreaId: workAreaIds.MANAGE_ACTIVTIES.EDIT,
    additionalData: entityCode
  },
  actionHandler: {}
});

const getCancelAction = (): IActionConfig => ({
  key: actionKeys.cancel,
  id: ACTION.Cancel,
  title: 'Cancel',
  toolTip: 'Cancel',
  actionHandler: {}
});

const getDeleteAction = (): IActionConfig => ({
  key: actionKeys.delete,
  id: ACTION.Delete,
  title: 'Delete',
  toolTip: 'Delete',
  disabled: false,
  actionHandler: {
    getTitle: () => 'Delete Activity',
    variant: Variant.Error,
    getDescription: () => 'Are you sure you want to delete selected Activity?',
    handleDelete: (customConfig) => handleDeleteActivity(customConfig)
  }
});

const getConverseAction = (): IActionConfig => ({
  key: '18',
  id: ACTION.Converse,
  title: 'Converse',
  toolTip: 'Converse',
  disabled: false,
  actionHandler: {}
});

export const manageActivityRowActions = (entityCode: string): IActionConfig[] => [
  getEditAction(entityCode),
  getCancelAction(),
  getDeleteAction(),
  getConverseAction()
];
