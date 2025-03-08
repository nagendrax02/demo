import { IWorkAreaConfig } from 'common/utils/process/process.types';
import { Theme } from 'common/types';
import { IConnectorConfig } from 'common/types/entity/lead';
import { IActionMenuItem } from 'apps/entity-details/types/entity-data.types';
import { ReactNode } from 'react';
import { IActionHandler } from 'apps/entity-details/types/action-handler.types';

export interface IMenuItem {
  label: string;
  value: string;
  customComponent?: ReactNode;
  clickHandler?: (item?: IMenuItem) => void;
  subMenu?: IMenuItem[] | IActionMenuItem[];
  isLoading?: boolean;
  disabled?: boolean;
  toolTip?: string;
  disableMenuCloseOnClick?: boolean;
  workAreaConfig?: IWorkAreaConfig;
  hiddenActions?: Record<string, boolean>;
  connectorConfig?: IConnectorConfig;
  id?: string;
  showInWeb?: boolean;
  showInMobile?: boolean;
  children?: IMenuItem[];
  canPerformAction?: (data: unknown) => boolean;
  showRecordCounter?: boolean;
  formId?: string;
  actionHandler?: IActionHandler;
}

export interface IActionWrapperItem {
  id?: string;
  isLoading?: boolean;
  workAreaConfig?: IWorkAreaConfig;
  subMenu?: IMenuItem[];
  isQuickAction?: boolean;
  hiddenActions?: Record<string, boolean>;
  toolTip?: string;
  title?: string;
  value?: string;
  key?: string;
  formId?: string;
}

export interface IActionWrapper {
  children: JSX.Element;
  action: IActionWrapperItem;
  tooltipTheme?: Theme;
  onMenuItemSelect: (menuItemData: IMenuItem) => void;
}
