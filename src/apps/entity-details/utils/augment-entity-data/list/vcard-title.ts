import { IList } from 'common/types/entity/list/list.types';
import { ITitleConfig } from 'apps/entity-details/types';

const getAugmentedTitle = (entityData: IList): ITitleConfig => {
  return { content: entityData?.details?.Name || '[No Name]' };
};

export { getAugmentedTitle };
