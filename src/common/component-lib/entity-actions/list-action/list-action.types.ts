import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

interface IListAction {
  entityIds: string[];
  handleClose: () => void;
  onSuccess: () => void;
  records: IRecordType[];
  actionType: string;
  isBulkOperation?: boolean;
  leadRepresentationName?: IEntityRepresentationName;
}

interface IHandleBulkOperation {
  results: IResults[];
  records: IRecordType[];
  entityIds: string[];
  setNotification: (notification: INotification) => void;
  handleClose: () => void;
  actionType: string;
  onSuccess: () => void;
}

interface IResults {
  value: [
    {
      EntityEngagedName: string;
      ListId: string;
      IsSuccessful: boolean;
      ExceptionMessage: string;
    }
  ];
  status: 'fulfilled' | 'rejected';
}

interface IHandleSuccess {
  setNotification: (notification: INotification) => void;
  actionType: string;
  listCount: number;
  listName: string;
  failure: boolean;
  message?: string;
}

interface IGetMessage {
  failureCount: number;
  entityIds: string[];
  results: IResults[];
  dictionary: Record<string, IRecordType>;
}

export type { IGetMessage, IListAction, IResults, IHandleBulkOperation, IHandleSuccess };
