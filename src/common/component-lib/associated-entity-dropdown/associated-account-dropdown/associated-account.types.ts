import { CallerSource } from 'common/utils/rest-client';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IAssociatedEntityDropdown } from '../associated-entity/associated-entity.types';

interface IAssociatedAccountOption extends IOption {
  AccountId: string;
  AccountName: string;
  AccountTypeId: string;
  AccountTypeName: string;
  AccountTypePluralName: string;
  Address: string;
  AutoId: string;
  Phone: string;
}

interface IAssociatedAccount extends Omit<IAssociatedEntityDropdown, 'fetchOptions'> {
  callerSource: CallerSource;
  accountTypeId?: string;
}

export type { IAssociatedAccountOption, IAssociatedAccount };
