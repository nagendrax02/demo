import { EntityType } from 'common/types';
import { IConfig } from '../../change-stage/change-stage.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { leadApiHandler } from './lead';
import { IResponse, ISearchParams } from '../update.types';
import { opportunityApiHandler } from './opportunity';
import { accountApiHandler } from './account';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';

export interface IApiHandler {
  entityId: string[];
  config: IConfig | undefined;
  commentsOptions: IOption[];
  message: string;
  actionType: string;
  selectedOption: {
    label: string;
    value: string;
  }[];
  secondarySelectedOption: {
    label: string;
    value: string;
  }[];
  eventCode?: number;
  entityIds: IEntityIds;
  searchParams?: ISearchParams;
  updatedAllPageRecord?: boolean;
}

export const getApiHandler: Record<string, (props: IApiHandler) => Promise<IResponse>> = {
  [EntityType.Lead]: leadApiHandler,
  [EntityType.Opportunity]: opportunityApiHandler,
  [EntityType.Account]: accountApiHandler
};
