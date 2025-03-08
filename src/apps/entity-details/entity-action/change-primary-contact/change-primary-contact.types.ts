import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { ReactNode } from 'react';
interface IResponseOption {
  value: string;
  label: string;
  text?: string;
  category?: null;
  isDefault?: boolean;
  customComponent?: ReactNode;
}

interface IAssociatedAccountOption extends IOption {
  ProspectID: string;
  ProspectAutoId: string;
  FirstName: string;
  LastName: null | string;
  EmailAddress: null | string;
  DoNotEmail: string;
  Phone: null | string;
  Mobile: null | string;
  Total: string;
  CanUpdate: string;
}

export interface IMessage {
  Id: string;
  IsSuccessful: boolean;
  Result: boolean;
}

interface IHandleResponse {
  Status: string;
  Message: IMessage;
}

export type { IResponseOption, IAssociatedAccountOption, IHandleResponse };
