import { PanelItem } from '@lsq/nextgen-preact/panel';
import useSmartViewStore from '../../smartviews-store';
import { renderAddComponents } from './components-renderer';
import styles from './sv-panel.module.css';
import FeatureRestriction from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

interface ISVPanelFooterProps {
  isLeftOriented: boolean;
  setShowAddTabModal: (showAddTabModal: boolean) => void;
}

const SVPanelFooter = ({
  isLeftOriented,
  setShowAddTabModal
}: ISVPanelFooterProps): JSX.Element | null => {
  const { allTabIds } = useSmartViewStore();
  const maxAllowedTabs = useSmartViewStore(
    (state) => state?.commonTabSettings?.maxAllowedTabs ?? 0
  );

  const { AddIconComponent, MaxTabToolTipComponent } = renderAddComponents(
    allTabIds,
    maxAllowedTabs
  );
  return (
    <FeatureRestriction
      actionName={FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].AddNewTab}
      moduleName={FeatureRestrictionModuleTypes.SmartViews}
      callerSource={CallerSource.SmartViews}>
      <MaxTabToolTipComponent isLeftOriented={isLeftOriented}>
        <PanelItem
          contentStyles={styles.sv_add_icon_parent_container}
          hoverProps={{ isHoverable: false }}>
          <AddIconComponent isLeftPanel={isLeftOriented} setShowAddTabModal={setShowAddTabModal} />
        </PanelItem>
      </MaxTabToolTipComponent>
    </FeatureRestriction>
  );
};

export default SVPanelFooter;
