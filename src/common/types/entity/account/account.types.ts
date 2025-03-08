import { IAccountDetails } from './details.types';
import { IAccountMetaData } from './metadata.types';

interface IAccount {
  details: IAccountDetails;
  metaData: IAccountMetaData;
}

export type { IAccount };
