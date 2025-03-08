import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntity } from 'common/types';
import { IBadgeConfig } from '../../../types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';

const getAugmentedBadge = (entityData: IEntity): IBadgeConfig => {
  try {
    const metaData = entityData?.details?.Fields;

    const stage = metaData?.[LEAD_SCHEMA_NAME.STAGE] as string;

    return { content: stage || '' };
  } catch (error) {
    trackError(error);
  }
  return { content: '' };
};

export { getAugmentedBadge };
