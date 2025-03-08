/* eslint-disable @typescript-eslint/naming-convention */
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IMenuItem } from '../action-wrapper/action-wrapper.types';
import { ActionType, PermissionEntityType } from 'common/utils/permission-manager';

interface IEntityExport {
  tabId: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAction: IMenuItem | null;
  entityRepName?: IEntityRepresentationName;
}

interface IFetchCriteria {
  entityCode?: string;
  advancedSearchText: string;
  searchText: string;
  sortColumn?: string;
  sortOrder?: number;
  ListId?: string;
  leadOnlyCondition?: string;
  task_Owner?: string;
  task_IncludeOverDue?: boolean;
  task_includeOnlyOverDue?: boolean;
  task_FromDate?: string | null;
  task_ToDate?: string | null;
  task_Status?: string | null;
  task_entitiesCount?: number;
  task_Type?: string;
  taskOnlyConditions?: string;
  stage?: string;
  datePickerField?: string;
  fromDate?: string;
  toDate?: string;
  ownerId?: string;
}

interface IError {
  name: string;
  response: IResponse;
  type: string;
  swLiteRequestInfo: ISwLiteRequestInfo;
}

interface IResponse {
  Status: string;
  ExceptionType: string;
  ExceptionMessage: string;
  RequestId: string;
  Data: object;
}

interface ISwLiteRequestInfo {
  url: string;
  method: string;
  callerSource: string;
}

enum ExceptionType {
  MXUnauthorizedRequestException = 'MXUnauthorizedRequestException',
  MXUnAuthorizedAccessException = 'MXUnAuthorizedAccessException'
}

enum ExceptionMessage {
  MXUnauthorizedRequestException = 'Export restricted for the user'
}

interface IResponseInfo {
  AccountEntitySettings: string;
  RestrictEntityExport: string;
  RestrictExportForAllEntities: string;
}

interface ISettingInfo {
  RestrictExportForAllEntities: boolean;
  AccountEntitySettings: string;
  RestrictEntityExport: string[];
}

interface IParsedRestrictEntityExport {
  Entity: string[];
}
interface IGetAccountAdvancedSearchText {
  AdvancedSearch: string;
  CustomFilters: string;
}

interface IExportPermission {
  entityType: PermissionEntityType;
  action: ActionType;
  entityCode: string;
  skipTaskUserValidation?: boolean;
}

export type {
  IError,
  ISettingInfo,
  IResponseInfo,
  IEntityExport,
  IFetchCriteria,
  IParsedRestrictEntityExport,
  IGetAccountAdvancedSearchText,
  IExportPermission
};
export { ExceptionType, ExceptionMessage };
