import { trackError } from 'common/utils/experience/utils/track-error';
import { ILead } from 'common/types';
import styles from './vcard-config.module.css';
import {
  ComponentType,
  IBodyConfig,
  IFooterConfig,
  IVCardConfig
} from '../../../types/vcard.types';
import { getAugmentedIcon } from './vcard-icon';
import { getAugmentedTitle } from './vcard-title';
import { getAugmentedBadge } from './vcard-badge';
import { getActions, getAugmentedQuickActions } from './vcard-action';
import { getAugmentedMetaData } from './vcard-metadata';
import { isMobileDevice } from 'common/utils/helpers';
import { META_DATA_FIELD_ORDER } from '../../../constants';

const getAugmentedFooter = (entityData: ILead): IFooterConfig | undefined => {
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

const getAugmentedMobileBody = (entityData: ILead, isUpdateRestricted?: boolean): IBodyConfig => {
  return {
    icon: getAugmentedIcon(entityData),
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

const getAugmentedBody = (entityData: ILead, isUpdateRestricted?: boolean): IBodyConfig => {
  return {
    icon: getAugmentedIcon(entityData),
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

const getAugmentedVCard = (entityData: ILead, isUpdateRestricted?: boolean): IVCardConfig => {
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
  if (typeof META_DATA_FIELD_ORDER[schemaName] === 'number') {
    return META_DATA_FIELD_ORDER[schemaName];
  }
  return Number.MAX_SAFE_INTEGER;
};

export {
  getAugmentedVCard,
  getAugmentedIcon,
  getAugmentedTitle,
  getAugmentedBadge,
  getActions,
  getAugmentedMetaData,
  getDisplayOrder
};
