import { IOpportunity } from 'common/types';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { ComponentType, IComponent, ISection } from '../../../../types/vcard.types';
import { getBadgeConfig } from './vcard-badge';
import { getMetaDataConfig } from './vcard-metadata';
import { OPP_INTERNAL_SCHEMA_NAMES } from '../constants';
import { getAssociatedLeadField } from './utils';
import styles from './vcard-config.module.css';

const getSecondarySection = (
  entityData: IOpportunity,
  secondaryConfig: IActivityAttribute[]
): ISection => {
  const secondaryComponents: IComponent[] = [];
  if (secondaryConfig && secondaryConfig?.length) {
    secondaryConfig.forEach((config) => {
      if (config?.InternalSchemaName === OPP_INTERNAL_SCHEMA_NAMES.opportunityStatus) {
        secondaryComponents.push({
          type: ComponentType.Badge,
          config: getBadgeConfig(entityData),
          showFieldSeperator: true
        });
      } else {
        secondaryComponents.push({
          type: ComponentType.MetaData,
          config: getMetaDataConfig(entityData, config),
          showFieldSeperator: true
        });
      }
    });
  }

  // Add lead name field
  secondaryComponents.push({
    type: ComponentType.MetaData,
    config: [getAssociatedLeadField(entityData)]
  });

  return {
    components: secondaryComponents,
    customStyleClass: styles.secondary_section
  };
};

export { getSecondarySection };
