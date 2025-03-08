import { IOpportunityDetails } from './detail.types';
import { IOpportunityMetaData } from './metadata.types';

export interface IOpportunity {
  details: IOpportunityDetails;
  metaData: IOpportunityMetaData;
}
