type ILogData = Record<string, unknown>;
interface IFatal {
  module: string;
  method: string;
  message: string;
  data: ILogData;
  error: unknown;
}

interface ICachedLogs<T> {
  LogType: T[];
}

enum LogType {
  Fatal = 'Fatal',
  Experience = 'Experience'
}

enum DeviceType {
  Tablet = 'Tablet',
  Mobile = 'Mobile',
  Desktop = 'Desktop',
  NA = 'NA'
}

interface ILogInfo {
  module: string;
  method: string;
  message: string;
  data: unknown;
  error?: unknown;
}

interface IUserAgent {
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  deviceType: string;
  connectionType: string;
}
interface ILog {
  CreatedOn: string;
  Message: string;
  LogType: string;
  OrgCode: string;
  UserId: string;
  RegionId: string;
  AppName: string;
  Class: string;
  Method: string;
  UserAgent: string;
  OSName: string;
  OSVersion: string;
  BrowserName: string;
  BrowserVersion: string;
  DeviceType: string;
  ConnectionType: string;
  Url: string;
  CustomData: string;
  Exception: string;
}

interface ITelemetryLog {
  CreatedOn: string;
  EndTime: number;
  ExperienceId: string;
  Input: string;
  Exception: string;
  Method: string;
  Class: string;
  OrgCode: string;
  OrgName: string;
  UserEmail: string;
  HttpMethod: string;
  RegionId: string;
  Url: string;
  UserId: string;
  LogType: string;
  Message: string;
  StatusCode: number;
  Took: number;
  StartTime: number;
  BuildVersions: string;
  AdditionalData: string;
  Module: string;
  EmbeddedContext: string;
  RequestContentType: string;
  ContentType: string;
  Initiator: string;
  TabId: string;
  Experience?: string;
}

interface IFindBrowserMatch {
  regex: RegExp;
  offset: number;
  browser: string;
  condition: boolean;
  userAgent: string;
}

export type {
  IFatal,
  ILog,
  IUserAgent,
  ILogInfo,
  IFindBrowserMatch,
  ILogData,
  ITelemetryLog,
  ICachedLogs
};
export { LogType, DeviceType };
