import { AuthKey } from 'common/utils/authentication/authentication.types';

interface IOpenOpportunityDetailsTab {
  entityId: string;
  eventCode: string | number;
  openInNewTab?: boolean;
}

export type IMipPreReqData = Record<AuthKey, string>;

export const MipPreReqData = 'mip_pre_reqdata';
export const MipData = '___mip-pre_reqdata___';

export type IResolveReject = (value: unknown) => void;

export interface IControllablePromise {
  promise: Promise<unknown>;
  resolve: IResolveReject | null;
  reject: IResolveReject | null;
}

export interface IExternalNavItem {
  Text: string;
  IconURL: string;
  Id: string;
  AppURL: string;
  isIconHidden?: boolean;
  parentId?: string;
}

export interface IExternalMenuHandler {
  onRender: (
    elem: HTMLAnchorElement | null,
    navBarPosition: 'LEFT' | 'TOP' | undefined,
    menuId?: string
  ) => void;
  fetchSubMenuData?: () => Promise<IExternalNavItem[]>;
}

export type ClassValue = string | undefined | null;

export type { IOpenOpportunityDetailsTab };
