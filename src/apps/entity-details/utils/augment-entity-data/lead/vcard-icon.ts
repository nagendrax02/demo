import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntity } from 'common/types';
import { IIconConfig, IconContentType } from '../../../types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';

const getAugmentedIcon = (entityData: IEntity): IIconConfig => {
  try {
    const metaData = entityData?.details?.Fields;

    const photoUrl = metaData?.[LEAD_SCHEMA_NAME.PHOTO_URL] as string;
    if (photoUrl) return { content: photoUrl, contentType: IconContentType.Image };

    const firstName = metaData?.[LEAD_SCHEMA_NAME.FIRST_NAME] as string;
    const lastName = metaData?.[LEAD_SCHEMA_NAME.LAST_NAME] as string;

    if (firstName || lastName) {
      return {
        content: `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`,
        contentType: IconContentType.Text
      };
    }
  } catch (error) {
    trackError(error);
  }

  return { content: '', contentType: IconContentType.Text };
};

export { getAugmentedIcon };
