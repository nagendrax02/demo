import { trackError } from 'common/utils/experience/utils/track-error';
import {
  IDashboard,
  IDashboardResponse,
  ISegregatedDashboard,
  IUserDashboardList
} from './dashboard.types';
export const SYSTEM_DASHBOARD_TYPE = 'System';

const getSystemDashboard = (userDashboardList: IUserDashboardList[]): IUserDashboardList | null => {
  return (
    userDashboardList?.find((element) => element?.DashboardType === SYSTEM_DASHBOARD_TYPE) || null
  );
};

const getUrl = (userDashboardId: string, isShared?: boolean): string => {
  if (isShared) {
    return `/Settings/ViewDashboard?Id=${userDashboardId}`;
  }
  return `/Dashboard/Index?userDashboardId=${userDashboardId}`;
};
const getMenuConfig = (dashboard: IUserDashboardList): IDashboard => {
  return {
    label: dashboard.UserDashboardName,
    dashboardId: dashboard.UserDashboardId,
    url: getUrl(dashboard?.UserDashboardId, dashboard?.IsShared)
  };
};

const sortUserDashboardList = (userDashboardList: IUserDashboardList[]): IUserDashboardList[] => {
  try {
    return userDashboardList?.sort(
      (firstDashboard: IUserDashboardList, secondDashboard: IUserDashboardList) => {
        return (
          Number(secondDashboard.IsFavourite || 0) - Number(firstDashboard.IsFavourite || 0) ||
          firstDashboard.UserDashboardName.localeCompare(secondDashboard.UserDashboardName)
        );
      }
    );
  } catch (error) {
    trackError(error);
  }
  return userDashboardList;
};

export const getSegregatedAction = (dashboards: IDashboardResponse): ISegregatedDashboard => {
  let adminDashboard = {} as IDashboard;
  const myDashboard: IDashboard[] = [];
  const sharedDashboard: IDashboard[] = [];

  const systemDashboard = getSystemDashboard(dashboards?.UserDashboardList);
  if (systemDashboard) adminDashboard = getMenuConfig(systemDashboard);

  const sortedUserDashboardList = sortUserDashboardList([...(dashboards?.UserDashboardList || [])]);

  sortedUserDashboardList?.forEach((config) => {
    if (config?.DashboardType === SYSTEM_DASHBOARD_TYPE) {
      return;
    }

    const menuConfig = getMenuConfig(config);
    if (config?.IsShared) {
      sharedDashboard.push(menuConfig);
    } else {
      myDashboard.push(menuConfig);
    }
  });

  return { adminDashboard, myDashboard, sharedDashboard };
};

export const canShowMenuItem = (label: string, searchKey: string): boolean => {
  if (!searchKey) return true;
  return label?.toLowerCase()?.includes(searchKey?.toLowerCase());
};
