import { Variant } from '@lsq/nextgen-preact/button/button.types';
import { IEntityRepresentationName } from './entity-data.types';

export interface ILeadDeleteResponse {
  RefrencedLeadIds?: string[];
  SuccessCount: number;
  FailureCount: number;
  ErrorMessage?: string;
}

export interface IDeleteActionHandler {
  getTitle: () => string;
  getDescription: (
    customConfig?: Record<string, string>,
    isBulkAction?: boolean
  ) => Promise<string>;
  handleDelete: (
    customConfig?: Record<string, string>,
    repName?: IEntityRepresentationName,
    isBulkAction?: boolean
  ) => Promise<void>;
  idDeleteDisabled?: () => Promise<boolean>;
  customeText?: string;
  variant?: Variant;
}

export type IActionHandler = IDeleteActionHandler | object;
