import {
  IActivityAttribute,
  IActivityMetaData
} from '../../../utils/entity-data-manager/activity/activity.types';

export interface IOpportunityMetaData extends Omit<IActivityMetaData, 'Fields'> {
  Fields?: Record<string, IActivityAttribute>;
}

export interface IOpportunityMetadataMap {
  [key: string]: IActivityAttribute;
}
