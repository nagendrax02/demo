import { useContext, useEffect, useState } from 'react';
import { PanelHeaderActions } from '@lsq/nextgen-preact/panel';
import { PanelState } from '../../constants/constants';
import useSmartViewStore from '../../smartviews-store';
import { renderAddComponents, renderPanelContents } from './components-renderer';
import { OrientationContext } from '../../SmartViews';
import FeatureRestriction from 'common/utils/feature-restriction';
import {
  FeatureRestrictionActionTypes,
  FeatureRestrictionModuleTypes
} from 'common/utils/feature-restriction/feature-restriction.types';
import { CallerSource } from 'common/utils/rest-client';

interface ISVHeaderProps {
  isLeftOriented: boolean;
  setToggleState: (panelState: PanelState) => void;
  setShowAddTabModal: (showAddTabModal: boolean) => void;
  toggleState: PanelState;
  overflowTabs: string[];
}

const SVHeader = ({
  isLeftOriented,
  setToggleState,
  setShowAddTabModal,
  toggleState,
  overflowTabs
}: ISVHeaderProps): JSX.Element => {
  const [showToggleInfo, setShowToggleInfo] = useState(false);
  const { allTabIds } = useSmartViewStore();
  const maxAllowedTabs = useSmartViewStore(
    (state) => state?.commonTabSettings?.maxAllowedTabs ?? 0
  );

  useEffect(() => {
    setShowToggleInfo(!!overflowTabs.length);
  }, [overflowTabs]);

  const orientationContext = useContext(OrientationContext);
  const { panelOrientation, setPanelOrientation } = orientationContext || {};

  const { SVPanelHeader } = renderPanelContents({
    isLeftOriented,
    panelOrientation,
    setPanelOrientation,
    toggleState,
    setToggleState,
    showToggleInfo,
    setShowToggleInfo
  });

  const { AddIconComponent } = renderAddComponents(allTabIds, maxAllowedTabs);

  return (
    <SVPanelHeader>
      <PanelHeaderActions>
        <FeatureRestriction
          actionName={
            FeatureRestrictionActionTypes[FeatureRestrictionModuleTypes.SmartViews].AddNewTab
          }
          moduleName={FeatureRestrictionModuleTypes.SmartViews}
          callerSource={CallerSource.SmartViews}>
          <AddIconComponent isLeftPanel={isLeftOriented} setShowAddTabModal={setShowAddTabModal} />
        </FeatureRestriction>
      </PanelHeaderActions>
    </SVPanelHeader>
  );
};

export default SVHeader;
