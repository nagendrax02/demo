import { IConnectorConfig } from './detail.types';

export enum CustomActionsKeys {
  CustomActions = 'Custom Actions',
  Messaging = 'Messaging'
}

export interface ICustomActions {
  Multiple?: {
    [key in CustomActionsKeys]?: IConnectorConfig[];
  };
  Single?: {
    [key in CustomActionsKeys]?: IConnectorConfig[];
  };
}
