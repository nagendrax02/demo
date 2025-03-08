import { IEntityProperty } from 'common/types/entity/lead/metadata.types';

interface IGetName {
  property: IEntityProperty;
  fields: Record<string, string | null> | undefined;
}

export type { IGetName };
