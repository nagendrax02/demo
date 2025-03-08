import SmartViewTab from './components/smartview-tab/SmartViewTab';
import useSmartViews from './use-smartviews';
import { PanelOrientation } from './constants/constants';
import styles from './smartviews.module.css';
import SmartViewsShimmer from './SmartviewsShimmer';
import { getCachedPanelOrientation, isCustomTypeTab } from './utils/utils';
import MediaModal from 'common/component-lib/media-modal/MediaModal';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { createContext, lazy, useState, useMemo, useEffect } from 'react';
import { isMiP } from 'common/utils/helpers';
import { Panel } from './components';
import GridQuickView from './components/grid-quick-view/GridQuickView';
import { classNames } from 'src/common/utils/helpers/helpers';
import SmartViewTabShimmer from './components/smartview-tab/SmartViewTabShimmer';

const CustomTypeTab = withSuspense(
  lazy(() => import('./components/custom-type-tab/CustomTypeTab'))
);

interface IPanelOrientationContextProps {
  panelOrientation: PanelOrientation;
  setPanelOrientation: React.Dispatch<React.SetStateAction<PanelOrientation>>;
}

export const OrientationContext = createContext<IPanelOrientationContextProps | undefined>(
  undefined
);

const SmartViews = (): JSX.Element => {
  const { isLoading, activeTabId, tabData, primaryColor, featureRestrictionRef, rawTabData } =
    useSmartViews();

  const [panelOrientation, setPanelOrientation] = useState<PanelOrientation>(PanelOrientation.Top);

  const tabPrimaryColorCssVariable: string = '--tab-primary-color';

  useEffect(() => {
    const fetchPanelOrientation = async (): Promise<void> => {
      const fetchedPanelOrientation = await getCachedPanelOrientation();
      setPanelOrientation(
        fetchedPanelOrientation === 1 ? PanelOrientation.Left : PanelOrientation.Top
      );
    };
    fetchPanelOrientation();
  }, []);

  const renderTab = (): JSX.Element | null => {
    if (isCustomTypeTab(rawTabData[activeTabId])) {
      return (
        <div
          className={`${styles.tab_container} ${styles.custom_tab_container} ${
            isMiP() ? styles.custom_tab_container_mip : ''
          }`}
          style={{ [tabPrimaryColorCssVariable]: `${primaryColor}` }}>
          <CustomTypeTab tabId={activeTabId} key={activeTabId} />
        </div>
      );
    }

    return tabData ? (
      <div
        className={classNames(
          panelOrientation === PanelOrientation.Left
            ? styles.tab_container
            : styles.tab_container_top,
          'ng_v2_style'
        )}
        style={{ [tabPrimaryColorCssVariable]: `${primaryColor}` }}>
        <SmartViewTab
          featureRestriction={featureRestrictionRef.current}
          tabId={activeTabId}
          tabData={tabData}
        />
      </div>
    ) : (
      <SmartViewTabShimmer
        styleClassName={
          panelOrientation == PanelOrientation.Left
            ? styles.layout_grid_container_with_leftpanel
            : ''
        }
      />
    );
  };

  const contextValue = useMemo(
    () => ({ panelOrientation, setPanelOrientation }),
    [panelOrientation, setPanelOrientation]
  );

  const getSmartViews = (): JSX.Element => {
    if (!Object.keys(rawTabData).length) {
      throw new Error('rawTabData not available in smartviews');
    }
    return (
      <div className={styles.layout}>
        <div
          className={classNames(
            styles.layout_sub_container,
            panelOrientation === PanelOrientation.Top ? styles.layout_top_sub_container : ''
          )}>
          <OrientationContext.Provider value={contextValue}>
            <Panel />
          </OrientationContext.Provider>
          {renderTab()}
          <MediaModal />
        </div>
        {!isCustomTypeTab(rawTabData[activeTabId]) ? <GridQuickView /> : null}
      </div>
    );
  };

  return isLoading ? <SmartViewsShimmer orientation={panelOrientation} /> : getSmartViews();
};

export default SmartViews;
