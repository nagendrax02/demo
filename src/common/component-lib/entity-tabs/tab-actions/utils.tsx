import { trackError } from 'common/utils/experience/utils/track-error';
import { ENTITY_FEATURE_RESTRICTION_CONFIG_MAP } from 'common/constants/feature-restriction';
import { EntityType } from '../../../types';
import { isFeatureRestricted } from 'common/utils/feature-restriction/utils/augment-data';
import TabRecordCounter from '../../tab-record-counter';
import { IAugmentedTabConfig } from '../types';
import styles from './tab-actions.module.css';

const getSettingsFeatureRestrictionPromise = (
  entityType: EntityType
): Promise<boolean>[] | undefined => {
  const featureRestrictionMap = ENTITY_FEATURE_RESTRICTION_CONFIG_MAP?.[entityType];

  if (featureRestrictionMap) {
    const promiseMap = [
      isFeatureRestricted({
        moduleName: featureRestrictionMap?.manageTabs.moduleName,
        actionName: featureRestrictionMap?.manageTabs.actionName,
        callerSource: featureRestrictionMap?.manageTabs?.callerSource
      }),
      isFeatureRestricted({
        moduleName: featureRestrictionMap?.addNewTab.moduleName,
        actionName: featureRestrictionMap?.addNewTab.actionName,
        callerSource: featureRestrictionMap?.addNewTab?.callerSource
      })
    ];

    return promiseMap;
  }
};

export const isSettingsActionRestricted = async (entityType: EntityType): Promise<boolean> => {
  try {
    if (entityType === EntityType.Account) return false;
    const promises = getSettingsFeatureRestrictionPromise(entityType);

    if (promises) {
      const [isManageTabsRestricted, isAddNewTabRestricted] = await Promise.all(promises);
      return isManageTabsRestricted && isAddNewTabRestricted;
    }
  } catch (err) {
    trackError(err);
  }

  return true;
};

export const getActionMenuItemWithCounter = (tab: IAugmentedTabConfig): JSX.Element => {
  return (
    <div className={styles.counter_menu_item_wrapper}>
      <div className={styles.counter_menu_item_label}>{tab?.name}</div>
      <TabRecordCounter tabId={tab?.id || ''} isMenuOption />
    </div>
  );
};
