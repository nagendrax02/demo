import { ITabResponse } from '../../smartviews.types';

export interface ICustomTypeInfo {
  SmartViewCustomTabTypeId: string;
  Name: string;
  DisplayName: string;
  AdvancedSearchConfig: string;
  GridConfig: string;
  ActionPanelConfig: string;
  TabConfig: string;
}

interface IPayload {
  URL?: string;
  Method?: string;
  PopupStyles?: string;
  AdvancedSearchJSON?: string;
  AdvancedSearchText?: string;
  height?: string;
  count?: number;
}

export interface IMessageData {
  type: string;
  action: string;
  payLoad: IPayload;
}

export interface IActionHandler {
  tabData: ITabResponse;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  payload: IPayload;
  handlePopUpAction?: (url: string, open: boolean, styles: string) => void;
}
