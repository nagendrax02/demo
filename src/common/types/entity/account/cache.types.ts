import { IAccountDetails } from './details.types';

type ICachedAccountDetails = Omit<IAccountDetails, 'Fields'>;

export type { ICachedAccountDetails };
