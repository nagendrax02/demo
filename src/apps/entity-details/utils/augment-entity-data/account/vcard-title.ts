import { trackError } from 'common/utils/experience/utils/track-error';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { ITitleConfig } from 'apps/entity-details/types';
import { IEntity } from 'common/types';

const getAugmentedTitle = (entityData: IEntity): ITitleConfig => {
  try {
    const metaData = entityData?.details?.Fields;

    const companyName = metaData?.[LEAD_SCHEMA_NAME.COMPANY_NAME];

    return {
      content: companyName || '[No Name]'
    };
  } catch (error) {
    trackError(error);
  }

  return { content: '[No Name]' };
};

export { getAugmentedTitle };
