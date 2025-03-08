import { IModuleConfig } from 'common/types/authentication.types';
import { IStatus } from 'apps/mip-menu/components/checkin-checkout/checkin-checkout.types';

export enum NavPosition {
  LEFT = 'LEFT',
  TOP = 'TOP'
}

export interface ICICOStatusConfig {
  CheckedInStatusList: IStatus[];
  CheckedOutStatusList: IStatus[];
}

export interface IHeaderInfo {
  FirstLoad?: boolean;
  IsCheckedIn?: boolean;
  Status?: IStatus;
  CheckedInTime?: string;
  CheckOutTime?: string;
}

export interface ICheckInResponse {
  LastCheckedOn: string;
  IsCheckedIn: boolean;
}

export type INavItem = IModuleConfig;
