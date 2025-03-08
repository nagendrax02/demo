import { trackError } from 'common/utils/experience/utils/track-error';
import { ComponentType, IBodyConfig, IVCardConfig } from '../../../types/vcard.types';
import styles from './vcard-config.module.css';
import { getAugmentedTitle } from './vcard-title';
import { getAugmentedInfo } from './vcard-info-box';
import { getActions } from './vcard-action';
import { IList } from 'common/types/entity/list/list.types';
import { getAugmentedIcon } from './vcard-icon';
import getCustomComponent from './vcard-custom-component';
import { ListType } from 'apps/smart-views/smartviews.types';

const getAugmentedBody = (entityData: IList): IBodyConfig => {
  return {
    icon: getAugmentedIcon(),
    primarySection: {
      components: [
        {
          type: ComponentType.Title,
          config: getAugmentedTitle(entityData),
          customStyleClass: styles.list_title
        },
        {
          type: ComponentType.Action,
          config: getActions(entityData),
          customStyleClass: styles.list_action
        }
      ],
      customStyleClass: styles.list_primary_section
    },
    secondarySection: {
      components: [
        {
          type: ComponentType.InfoBox,
          config: getAugmentedInfo(entityData)
        }
      ]
    }
  };
};

const getBody = (entityData: IList): IBodyConfig => {
  const body = getAugmentedBody(entityData);

  if (entityData?.details?.ListType === ListType.REFRESHABLE) {
    body?.primarySection?.components?.splice(1, 0, {
      type: ComponentType.CustomComponent,
      config: getCustomComponent()
    });
  }

  return body;
};

const getAugmentedVCard = (entityData: IList): IVCardConfig => {
  try {
    return {
      body: getBody(entityData)
    };
  } catch (error) {
    trackError(error);
    throw error;
  }
};

export { getAugmentedVCard, getAugmentedTitle };
