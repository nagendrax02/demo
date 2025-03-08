export interface IUserDashboardList {
  UserDashboardId: string;
  UserDashboardName: string;
  DashboardType: string;
  IsFavourite: boolean;
  IsShared?: boolean;
}

export interface IDashboardResponse {
  RecordCount: number;
  UserDashboardList: IUserDashboardList[];
}

export interface IDashboard {
  label: string;
  dashboardId: string;
  url: string;
}
export interface ISegregatedDashboard {
  adminDashboard: IDashboard;
  sharedDashboard: IDashboard[];
  myDashboard: IDashboard[];
}
