import Search from '@lsq/nextgen-preact/v2/text-field/search-bar';
import { Panel, PanelBody, PanelHeader } from '@lsq/nextgen-preact/panel';
import styles from './manage-activity-tab.module.css';
import actionContainerStyles from '../../../smartviews.module.css';
import { IActivityCategoryMetadata } from 'apps/activity-history/types';
import { useEffect, useState } from 'react';
import ActivitiesList from './ActivitiesList';
import { PanelState } from 'apps/external-app/external-app.types';
import { getFromDB, getItem, setInDB, setItem, StorageKey } from 'common/utils/storage-manager';
import { API_ROUTES } from 'common/constants';
import { CallerSource, httpGet, httpPost, Module } from 'common/utils/rest-client';
import { HTTP_HEADERS } from 'common/utils/rest-client/constant';
import { trackError } from 'common/utils/experience';
import { LeftPanelCollapse } from 'assets/custom-icon/v2';
import { classNames, safeParseJson } from 'common/utils/helpers/helpers';
import { ExpandMenueTooltip } from '../../panel/components-renderer';
const LeftPanel = ({
  categoryData,
  selectedActivity
}: {
  categoryData: IActivityCategoryMetadata[];
  selectedActivity: string;
}): JSX.Element => {
  const [pinnedActivityEventCodes, setPinnedActivityEventCodes] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<IActivityCategoryMetadata[]>([]);

  const getPinnedActivityEventCodes = async (): Promise<Record<string, boolean>> => {
    try {
      const cachedPinnedActivities = await getFromDB<Record<string, boolean>>(
        StorageKey.ManageActivityPinnedActivities
      );
      if (cachedPinnedActivities) {
        return cachedPinnedActivities;
      }

      const response = await httpGet<string>({
        path: `${API_ROUTES.cacheGet}${StorageKey.ManageActivityPinnedActivities}`,
        module: Module.Cache,
        callerSource: CallerSource.ManageActivities,
        requestConfig: { headers: { [HTTP_HEADERS.cacheControl]: 'no-cache' } }
      });
      if (response) {
        const parsedResponse = safeParseJson<Record<string, boolean>>(response) ?? {};
        setInDB(StorageKey.ManageActivityPinnedActivities, parsedResponse, true);
        return parsedResponse;
      }
    } catch (error) {
      trackError(error);
    }
    return {};
  };
  const handlePinToggle = (activity: IActivityCategoryMetadata): void => {
    const updatedPinnedEventCodes = { ...pinnedActivityEventCodes };

    if (updatedPinnedEventCodes[activity.Value]) {
      delete updatedPinnedEventCodes[activity.Value];
    } else {
      updatedPinnedEventCodes[activity.Value] = true;
    }

    setPinnedActivityEventCodes(updatedPinnedEventCodes);
    setInDB(StorageKey.ManageActivityPinnedActivities, updatedPinnedEventCodes, true);
    httpPost({
      path: API_ROUTES.cachePost,
      module: Module.Cache,
      callerSource: CallerSource.ManageActivities,
      body: {
        key: StorageKey.ManageActivityPinnedActivities,
        Value: JSON.stringify(updatedPinnedEventCodes)
      }
    });
  };

  const [toggleState, setToggleState] = useState<PanelState>(() => {
    const storedState = getItem(StorageKey.ManageActivityPanelState);
    return storedState ? (storedState as PanelState) : PanelState.Open;
  });
  const handlePanelState = (): void => {
    setToggleState((prevState) => {
      const newState = prevState === PanelState.Open ? PanelState.Close : PanelState.Open;
      setItem(StorageKey.ManageActivityPanelState, JSON.stringify(newState));
      return newState;
    });
  };

  const renderHeader = (): JSX.Element => (
    <PanelHeader
      customStyleClass={styles.left_panel_header}
      title="Activity Types"
      headerTextClass={classNames('ng_h_5_sb')}
      collapseProps={{
        isCollapsible: true,
        onPanelCollapse: handlePanelState,
        customCollapseIconStyles: actionContainerStyles.action_container
      }}
      toggleProps={{
        isToggleable: false
      }}>
      <></>
    </PanelHeader>
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePanelState();
    }
  };

  useEffect(() => {
    const fetchPinnedActivityEventCodes = async (): Promise<void> => {
      const codes = await getPinnedActivityEventCodes();
      setPinnedActivityEventCodes(codes);
    };
    fetchPinnedActivityEventCodes();
  }, []);
  useEffect(() => {
    if (!searchQuery && !categoryData) return;
    setFilteredActivities(
      categoryData.filter((activity) =>
        activity.Text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, categoryData]);

  return (
    <>
      {toggleState === PanelState.Close ? (
        <ExpandMenueTooltip>
          <button
            className={styles.sv_collapse_container}
            onClick={handlePanelState}
            onKeyDown={handleKeyDown}
            aria-label="Expand Left Panel">
            <div className={styles.sv_collapse_wrapper}>
              <LeftPanelCollapse type="outline" className={styles.left_panel_collapse} />
            </div>
          </button>
        </ExpandMenueTooltip>
      ) : (
        <Panel customStyleClass={styles.panel}>
          {renderHeader()}
          <PanelBody customStyleClass={styles.content_container}>
            <Search value={searchQuery} onChange={setSearchQuery} size="xs" />
            <ActivitiesList
              activities={filteredActivities}
              pinnedEventCodes={pinnedActivityEventCodes}
              handlePinToggle={handlePinToggle}
              selectedActivity={selectedActivity}
            />
          </PanelBody>
        </Panel>
      )}
    </>
  );
};

export default LeftPanel;
