import { CallerSource } from 'common/utils/rest-client';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { FEATURE_NAMES } from 'apps/header/constants';
import styles from '../styles.module.css';
import FeatureRestriction, { getUnrestrictedActions } from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import PlaceholderNavItem from '../placeholder-nav-item';
import MoreActions from 'apps/entity-details/components/vcard/actions/more-actions';
import {
  IActionMenuItem,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import {
  DEFAULT_ENTITY_REP_NAMES,
  MOCK_ENTITY_DETAILS_CORE_DATA_FOR_QUICK_ADD
} from 'common/constants';
import { EntityType } from 'common/types';
import useHeaderStore from 'apps/header/header.store';
import { QUICK_ADD_FEATURE_RESTRICTION_MAP } from './constants';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { useEffect, useState } from 'react';
import { getAugmentedAction } from './utils';

const QuickAdd = (): JSX.Element => {
  const [augmentedQuickActions, setAugmentedQuickActions] = useState<IActionMenuItem[]>([]);
  const setRestrictedFeature = useHeaderStore((state) => state.setRestrictedFeature);
  const leadRepName = useLeadRepName();

  useEffect(() => {
    (async (): Promise<void> => {
      const augmentedActions = await getUnrestrictedActions<IActionMenuItem>(
        QUICK_ADD_FEATURE_RESTRICTION_MAP,
        getAugmentedAction(leadRepName)
      );
      setAugmentedQuickActions(augmentedActions);
    })();
  }, []);

  const coreData: IEntityDetailsCoreData = {
    ...MOCK_ENTITY_DETAILS_CORE_DATA_FOR_QUICK_ADD,
    entityDetailsType: EntityType.Lead,
    entityIds: {
      ...MOCK_ENTITY_DETAILS_CORE_DATA_FOR_QUICK_ADD.entityIds
    },
    entityRepNames: {
      ...DEFAULT_ENTITY_REP_NAMES
    }
  };

  const customButton = (): JSX.Element => <Icon name="add_box" variant={IconVariant.Filled} />;

  const handleRestrictionChange = (isRestricted: boolean): void => {
    if (isRestricted) {
      setRestrictedFeature(FEATURE_NAMES.QUICK_ADD);
    }
  };

  return (
    <FeatureRestriction
      actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.Navigation].GlobalAdd}
      moduleName={FeatureRestrictionModuleTypes.Navigation}
      callerSource={CallerSource.MarvinHeader}
      onRestrictionChange={handleRestrictionChange}
      placeholderElement={<PlaceholderNavItem />}>
      <div className={styles.nav_item}>
        <MoreActions
          menuDimension={{ topOffset: 10, leftOffset: 40 }}
          customButton={customButton}
          coreData={coreData}
          actions={augmentedQuickActions}
        />
      </div>
    </FeatureRestriction>
  );
};

export default QuickAdd;
