import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntity } from 'common/types';
import { ITitleConfig } from '../../../types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';

const getAugmentedTitle = (entityData: IEntity): ITitleConfig => {
  try {
    const metaData = entityData?.details?.Fields;

    const firstName = metaData?.[LEAD_SCHEMA_NAME.FIRST_NAME] as string;
    const lastName = metaData?.[LEAD_SCHEMA_NAME.LAST_NAME] as string;

    return {
      content:
        firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '[No Name]'
    };
  } catch (error) {
    trackError(error);
  }

  return { content: '[No Name]' };
};

export { getAugmentedTitle };
