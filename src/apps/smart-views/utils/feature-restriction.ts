import { trackError } from 'common/utils/experience/utils/track-error';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes,
  IRestrictionData
} from 'common/utils/feature-restriction/feature-restriction.types';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import { CallerSource } from 'common/utils/rest-client';
import { IGetIsFeatureRestriction } from '../smartviews.types';

const getIsFeatureRestricted = async (
  actionName: string,
  restrictionData: IRestrictionData
): Promise<boolean> => {
  try {
    const result = await isFeatureRestricted({
      actionName: actionName,
      moduleName: FeatureRestrictionModuleTypes.SmartViews,
      restrictionData,
      callerSource: CallerSource.SmartViews
    });
    return result;
  } catch (error) {
    trackError(error);
  }
  return true;
};

const getIsManageTasksFeatureRestricted = async (
  actionName: string,
  restrictionData: IRestrictionData
): Promise<boolean> => {
  try {
    const result = await isFeatureRestricted({
      actionName: actionName,
      moduleName: FeatureRestrictionModuleTypes.ManageTasks,
      restrictionData,
      callerSource: CallerSource.ManageTasks
    });
    return result;
  } catch (error) {
    trackError(error);
  }
  return true;
};

const getIsManageLeadsFeatureRestricted = async (
  actionName: string,
  restrictionData: IRestrictionData
): Promise<boolean> => {
  try {
    const result = await isFeatureRestricted({
      actionName: actionName,
      moduleName: FeatureRestrictionModuleTypes.ManageLeads,
      restrictionData,
      callerSource: CallerSource.ManageLeads
    });
    return result;
  } catch (error) {
    trackError(error);
  }
  return true;
};

export const getIsFeatureRestriction = async (
  restrictionData: IRestrictionData
): Promise<IGetIsFeatureRestriction> => {
  const actionNames = {
    sorting: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].Sorting,
    rowActions: FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].RowActions,
    bulkActions:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].BulkActions,
    isManageLeadsViewRestricted:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageLeads].View,
    isManageTasksViewRestricted:
      FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.ManageTasks].View
  };

  try {
    const [
      sortingResult,
      rowActionsResult,
      bulkActionsResult,
      manageLeadResults,
      manageTaskResult
    ] = await Promise.all([
      getIsFeatureRestricted(actionNames?.sorting, restrictionData),
      getIsFeatureRestricted(actionNames?.rowActions, restrictionData),
      getIsFeatureRestricted(actionNames?.bulkActions, restrictionData),
      getIsManageLeadsFeatureRestricted(actionNames?.isManageLeadsViewRestricted, restrictionData),
      getIsManageTasksFeatureRestricted(actionNames?.isManageTasksViewRestricted, restrictionData)
    ]);

    return {
      isFeatureRestrictedForSorting: sortingResult,
      isFeatureRestrictedForRowActions: rowActionsResult,
      isFeatureRestrictedForBulkActions: bulkActionsResult,
      isManageLeadsViewRestricted: manageLeadResults,
      isManageTasksViewRestricted: manageTaskResult
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
