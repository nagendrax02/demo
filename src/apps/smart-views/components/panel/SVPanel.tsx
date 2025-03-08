import useSmartViewStore, { setAllTabIds } from 'apps/smart-views/smartviews-store';
import styles from './sv-panel.module.css';
import { PanelOrientation, PanelState } from 'apps/smart-views/constants/constants';
import { useContext, useRef, useState } from 'react';
import { Panel, PanelBody } from '@lsq/nextgen-preact/panel';
import ConfigureTab from '../external-components/configure-tab';
import useResizeTabs from './useResizeTabs';
import { renderPanelContents, renderTabContent } from './components-renderer';
import { OrientationContext } from '../../SmartViews';
import { clearSVMetadataCache } from '../../utils/utils';
import { saveDefaultTab, saveTabOrder } from './components/manage-tabs/utils';
import { alertConfig } from './constants';
import useManageSVTabsStore from './components/manage-tabs/manage-tabs.store';
import { useNotification } from '@lsq/nextgen-preact/notification';
import useSortableList from './useSortableList';
import MoreOptions from './MoreOptions';
import SVHeader from './SVHeader';
import SVPanelFooter from './SVPanelFooter';
import { isMiP, safeParseJson } from 'common/utils/helpers';
import { trackError } from 'common/utils/experience';
import useReorderTabs from './useReorderTabs';

const SVPanel = (): JSX.Element => {
  const { rawTabData } = useSmartViewStore();
  const sortableList = useManageSVTabsStore((state) => state.sortableList);
  const { showAlert } = useNotification();
  const [toggleState, setToggleState] = useState(PanelState.Open);
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const orientationContext = useContext(OrientationContext) as {
    panelOrientation: PanelOrientation;
    setPanelOrientation: (orientation: PanelOrientation) => void;
  };
  const { panelOrientation, setPanelOrientation } = orientationContext;

  const isLeftOriented = panelOrientation === PanelOrientation.Left;

  useReorderTabs();

  const { visibleTabs, overflowTabs } = useResizeTabs(
    containerRef,
    panelOrientation ?? PanelOrientation.Top
  );

  const { SVCollapseState, selectPanelContainerStyles } = renderPanelContents({
    isLeftOriented,
    panelOrientation,
    setPanelOrientation,
    toggleState,
    setToggleState
  });

  const { getTabList, getOverflowTabList } = renderTabContent(
    { visibleTabs, overflowTabs },
    rawTabData,
    setShowMoreOptions
  );

  useSortableList();

  const handleDragStart = (event): void => {
    const tabId = event.currentTarget.getAttribute('data-id') as string;
    const tabIndex = sortableList.findIndex((tab) => tab.id === tabId);
    event.dataTransfer.setData('text/plain', tabIndex.toString());
  };

  const handleDrop = async (event): Promise<void> => {
    const tabId = event.currentTarget.getAttribute('data-id') as string;
    const index = sortableList.findIndex((tab) => tab.id === tabId);
    try {
      event.preventDefault();
      const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
      if (index !== sourceIndex && !isNaN(sourceIndex)) {
        const clonedList: { id: string }[] = safeParseJson(JSON.stringify(sortableList)) as {
          id: string;
        }[];
        const [changeItem] = clonedList.splice(sourceIndex, 1);
        clonedList?.splice(index, 0, changeItem);
        const updatedTabIds = clonedList.map((tab) => tab.id);
        setAllTabIds(updatedTabIds);

        // default tab
        if (index === 0) {
          await saveDefaultTab(changeItem.id);
        }

        // order
        await saveTabOrder(updatedTabIds);
        await clearSVMetadataCache();

        showAlert(alertConfig.TAB_UPDATE_SUCCESS);
      }
    } catch (error) {
      showAlert(alertConfig.TAB_UPDATE_FAIL);
      trackError(error);
    }
  };

  const renderPanelContentContainer = (): JSX.Element => {
    if (!isLeftOriented) {
      return (
        <div className={styles.sv_panel_sub_container} ref={containerRef}>
          <PanelBody
            customStyleClass={styles.sv_content_container_top}
            onContentDrop={handleDrop}
            onContentDragStart={handleDragStart}
            dragItems={getTabList()}
            showDragIcon={false}
          />
          {overflowTabs.length > 0 ? (
            <MoreOptions
              getOverflowTabList={getOverflowTabList}
              showMoreOptions={showMoreOptions}
              setShowMoreOptions={setShowMoreOptions}
              handleDrop={handleDrop}
              handleDragStart={handleDragStart}
            />
          ) : null}
          <SVPanelFooter isLeftOriented={isLeftOriented} setShowAddTabModal={setShowAddTabModal} />
        </div>
      );
    } else {
      return (
        <PanelBody
          customStyleClass={styles.sv_content_container}
          onContentDrop={handleDrop}
          onContentDragStart={handleDragStart}
          dragItems={getTabList()}
        />
      );
    }
  };

  const renderPanel = (): JSX.Element => {
    return (
      <Panel customStyleClass={selectPanelContainerStyles()} ariaLabel="Smart Views">
        {!isMiP() ? (
          <SVHeader
            isLeftOriented={isLeftOriented}
            setToggleState={setToggleState}
            setShowAddTabModal={setShowAddTabModal}
            toggleState={toggleState}
            overflowTabs={overflowTabs}
          />
        ) : null}
        {renderPanelContentContainer()}
      </Panel>
    );
  };

  return (
    <>
      {toggleState === PanelState.Close ? <SVCollapseState /> : renderPanel()}
      {showAddTabModal ? (
        <ConfigureTab
          show={showAddTabModal}
          onClose={(show: boolean) => {
            if (!show) setShowAddTabModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default SVPanel;
