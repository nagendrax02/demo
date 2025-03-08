import { IOpportunity } from 'common/types';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { ComponentType, IComponent, ISection } from '../../../../types/vcard.types';
import styles from './vcard-config.module.css';
import { OPP_INTERNAL_SCHEMA_NAMES } from '../constants';
import { getVcardActions, getVcardQuickActions } from './vcard-action';
import { getBadgeConfig } from './vcard-badge';

const getPrimarySection = (
  entityData: IOpportunity,
  primaryConfig: IActivityAttribute[],
  isUpdateRestricted?: boolean
): ISection => {
  const primaryComponents: IComponent[] = [];
  const fieldData = entityData?.details?.Fields;
  if (primaryConfig && primaryConfig?.length === 1) {
    const titleComp = primaryConfig[0];
    const titleContent = fieldData?.[titleComp?.SchemaName] || '';
    if (titleComp?.InternalSchemaName === OPP_INTERNAL_SCHEMA_NAMES.title) {
      primaryComponents.push({
        type: ComponentType.Title,
        config: {
          content: titleContent
        }
      });
    } else if (titleComp?.InternalSchemaName === OPP_INTERNAL_SCHEMA_NAMES.opportunityStatus) {
      primaryComponents.push({
        type: ComponentType.Badge,
        config: getBadgeConfig(entityData)
      });
    } else {
      primaryComponents?.push({
        type: ComponentType.Title,
        config: {
          content: titleContent,
          CustomComponent: (
            <div className={styles.title_wrapper}>
              <div className={styles.title_field}>{`${titleComp?.DisplayName}:`}</div>
              <div className={styles.title_value}>{fieldData?.[titleComp?.SchemaName]}</div>
            </div>
          )
        }
      });
    }
  }

  primaryComponents.push({
    type: ComponentType.QuickAction,
    config: getVcardQuickActions(entityData, isUpdateRestricted),
    customStyleClass: styles.vcard_quick_action
  });

  if (entityData?.details?.ActionsConfiguration) {
    primaryComponents.push({
      type: ComponentType.Action,
      config: getVcardActions(entityData, isUpdateRestricted),
      customStyleClass: styles.vcard_action
    });
  }

  return {
    components: primaryComponents,
    customStyleClass: styles.vcard_primary_section
  };
};

export { getPrimarySection };
