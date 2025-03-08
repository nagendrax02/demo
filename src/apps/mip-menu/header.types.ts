import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
export interface IHeader {
  Id: string;
  Path: string;
  Group: string;
  Caption: string;
  HelpText: string;
  SortOrder: number;
  ParentId?: string;
  ImageURL?: string;
  ActionName: string;
  Children?: IHeader[];
  ShowHelptext: boolean;
  ControllerName: string;
  RelatedConnectorId?: string;
  CustomApplicationMenuId?: string;
}

export type IHeaderItem = IMenuItem & IHeader;
