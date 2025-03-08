import { trackError } from 'common/utils/experience/utils/track-error';
import { IVCardConfig } from 'apps/entity-details/types';
import { ComponentType, IBodyConfig, IFooterConfig } from 'apps/entity-details/types/vcard.types';
import { IAccount } from 'common/types';
import { isMobileDevice } from 'common/utils/helpers';
import { getAugmentedIcon } from './vcard-icon';
import { getAugmentedTitle } from './vcard-title';
import styles from './vcard-config.module.css';
import { getAugmentedBadge } from './vcard-badge';
import { getAugmentedMetaData } from './vcard-metadata';
import { ACCOUNT_META_DATA_FIELD_ORDER } from 'apps/entity-details/constants';
import { getActions, getAugmentedQuickActions } from './vcard-action';

const getAugmentedFooter = (entityData: IAccount): IFooterConfig | undefined => {
  if (isMobileDevice()) {
    return {
      components: [
        {
          type: ComponentType.Action,
          config: getActions(entityData)
        }
      ]
    };
  }
  return undefined;
};

const getAugmentedMobileBody = (
  entityData: IAccount,
  isUpdateRestricted?: boolean
): IBodyConfig => {
  return {
    icon: getAugmentedIcon(),
    primarySection: {
      components: [
        {
          type: ComponentType.Title,
          config: getAugmentedTitle(entityData),
          customStyleClass: styles.lead_title
        },
        {
          type: ComponentType.QuickAction,
          config: getAugmentedQuickActions(entityData, isUpdateRestricted),
          customStyleClass: styles.lead_quick_action_mobile
        }
      ]
    },
    secondarySection: {
      components: [
        {
          type: ComponentType.Badge,
          config: getAugmentedBadge(entityData),
          customStyleClass: styles.lead_badge
        }
      ]
    },
    tertiarySection: {
      components: [
        {
          type: ComponentType.MetaData,
          config: getAugmentedMetaData(entityData)
        }
      ]
    }
  };
};

const getAugmentedBody = (entityData: IAccount, isUpdateRestricted?: boolean): IBodyConfig => {
  return {
    icon: getAugmentedIcon(),
    primarySection: {
      components: [
        {
          type: ComponentType.Title,
          config: getAugmentedTitle(entityData),
          customStyleClass: styles.lead_title
        },
        {
          type: ComponentType.Badge,
          config: getAugmentedBadge(entityData),
          customStyleClass: styles.lead_badge
        },
        {
          type: ComponentType.QuickAction,
          config: getAugmentedQuickActions(entityData, isUpdateRestricted),
          customStyleClass: styles.lead_quick_action
        },
        {
          type: ComponentType.Action,
          config: getActions(entityData),
          customStyleClass: styles.lead_action
        }
      ],
      customStyleClass: styles.lead_primary_section
    },
    secondarySection: {
      components: [
        {
          type: ComponentType.MetaData,
          config: getAugmentedMetaData(entityData)
        }
      ]
    }
  };
};

const getAugmentedVCard = (entityData: IAccount, isUpdateRestricted?: boolean): IVCardConfig => {
  try {
    return {
      body: isMobileDevice()
        ? getAugmentedMobileBody(entityData, isUpdateRestricted)
        : getAugmentedBody(entityData, isUpdateRestricted),
      footer: getAugmentedFooter(entityData)
    };
  } catch (error) {
    trackError(error);
    throw error;
  }
};

const getDisplayOrder = (schemaName: string): number => {
  if (typeof ACCOUNT_META_DATA_FIELD_ORDER[schemaName] === 'number') {
    return ACCOUNT_META_DATA_FIELD_ORDER[schemaName];
  }
  return Number.MAX_SAFE_INTEGER;
};

export {
  getAugmentedVCard,
  getAugmentedIcon,
  getAugmentedTitle,
  getAugmentedBadge,
  getAugmentedMetaData,
  getDisplayOrder
};
