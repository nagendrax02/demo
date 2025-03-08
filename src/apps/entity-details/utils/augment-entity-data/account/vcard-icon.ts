import { IIconConfig, IconContentType } from 'apps/entity-details/types';

const getAugmentedIcon = (): IIconConfig => {
  return { content: 'business', contentType: IconContentType.Icon };
};

export { getAugmentedIcon };
