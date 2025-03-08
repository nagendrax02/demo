import { ILeadDetails } from './detail.types';
import { ILeadMetaData } from './metadata.types';

interface ILead {
  details: ILeadDetails;
  metaData: ILeadMetaData;
}

export type { ILead };
