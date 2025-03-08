import { IEntityRepresentationName } from '../../types/entity-data.types';

export const updateEntityName = (text: string, repName?: IEntityRepresentationName): string => {
  return text.replace('{entityPlural}', `${repName?.PluralName ?? 'Leads'}`);
};
