import { IGridConfig } from '../../smartview-tab/smartview-tab.types';
export interface IReceivedMessage {
  type: string;
  message: unknown;
}

export interface ICalendarPopup {
  gridConfig: IGridConfig;
  task: Record<string, unknown>;
  closePopup: () => void;
}
