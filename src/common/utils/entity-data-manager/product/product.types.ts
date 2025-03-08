import { CallerSource } from 'common/utils/rest-client';
import { IFetchDropdownPayload } from '../entity-data-manager.types';

interface IBody extends Pick<IFetchDropdownPayload, 'searchText'> {
  getProductwithSKU?: boolean;
  count?: number;
}
interface IFetchProductDropdownOptions {
  body: IBody;
  callerSource: CallerSource;
}

export type { IFetchProductDropdownOptions };
