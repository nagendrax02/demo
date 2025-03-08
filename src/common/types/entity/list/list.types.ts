import { IListDetails, IListMetaData } from './detail.types';

interface IList {
  details: IListDetails;
  metaData: IListMetaData;
  scheduledEmailCount: number;
}

export type { IList };
