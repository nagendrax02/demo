export interface IManageTabsRef {
  isListOrderChanged: boolean;
  currentDefaultTabId: string;
  deleteTabIds: string[];
  removeCallback: () => void;
  currentRemoveTabName: string;
}
