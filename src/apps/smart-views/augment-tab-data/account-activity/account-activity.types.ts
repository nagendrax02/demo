import { IActionConfig } from 'apps/entity-details/types';
import { ICommonTabSettings, ISvActionConfig, IUserPermission } from '../../smartviews.types';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';

interface IAccountActivityData {
  [key: string]: string;
}
export interface IAccountActivityGetResponse {
  Activities: IAccountActivityData[];
  RecordCount: number;
}

export interface IActionReducer {
  item: IActionConfig;
  actionConfig?: ISvActionConfig;
  moreActions: IActionMenuItem[];
  quickActions: IActionConfig[];
  isMarvinTab?: boolean;
  canDelete?: boolean;
  userPermissions?: IUserPermission;
  commonTabSettings?: ICommonTabSettings;
}
