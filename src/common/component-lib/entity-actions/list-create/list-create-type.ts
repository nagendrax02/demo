import { IMenuItem } from '@lsq/nextgen-preact/action-menu/action-menu.types';
import { IRecordType } from 'src/apps/smart-views/components/smartview-tab/smartview-tab.types';

interface IListCreate {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAction: IMenuItem | null;
  tabId?: string;
  records?: IRecordType;
}

enum ListEvent {
  CreateList = 'CreateList',
  CloseList = 'CloseList'
}

export type { IListCreate };

export { ListEvent };
