import { lazy } from 'react';
import { ITabsConfig } from 'apps/entity-details/types';
import System from '../System';
import ConnectorTab from 'apps/entity-connector-tab';
import ErrorBoundary from 'common/component-lib/error-boundary';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const CustomActivityHistory = withSuspense(
  lazy(() => import('apps/activity-history/CustomActivityHistory'))
);

interface IRenderer {
  tab: ITabsConfig | undefined;
  coreData: IEntityDetailsCoreData;
}

const TabType = {
  System: 0,
  Connector: 1,
  CustomActivity: 2,
  // type 3 is added through LDVC
  CustomTab: 3
};

// eslint-disable-next-line complexity
const Renderer = ({ tab, coreData }: IRenderer): JSX.Element => {
  if (tab?.id) {
    switch (tab?.type) {
      case TabType.System:
        return (
          <div data-testid="system-tab">
            <ErrorBoundary module={`system-tab-${tab.name}`} key={`system-tab-${tab.name}`}>
              <System tab={tab} coreData={coreData} />
            </ErrorBoundary>
          </div>
        );
      case TabType.Connector:
        return (
          <div data-testid="connector-tab">
            <ErrorBoundary module={`connector-tab-${tab.name}`} key={`connector-tab-${tab.name}`}>
              <ConnectorTab tab={tab} entityDetailsCoreData={coreData} />
            </ErrorBoundary>
          </div>
        );
      case TabType.CustomActivity:
        return (
          <ErrorBoundary
            module={`custom-activity-tab-${tab.name}`}
            key={`custom-activity-tab-${tab.name}`}>
            <div data-testid="custom-activity-tab">
              <CustomActivityHistory tab={tab} entityDetailsCoreData={coreData} />
            </div>
          </ErrorBoundary>
        );
      case TabType.CustomTab:
        if (!tab?.url) {
          return (
            <ErrorBoundary
              module={`custom-activity-tab-${tab.name}`}
              key={`custom-activity-tab-${tab.name}`}>
              <div data-testid="custom-activity-tab">
                <CustomActivityHistory tab={tab} entityDetailsCoreData={coreData} />
              </div>
            </ErrorBoundary>
          );
        }
        if (tab?.url) {
          return (
            <ErrorBoundary module={`connector-tab-${tab.name}`} key={`connector-tab-${tab.name}`}>
              <ConnectorTab tab={tab} entityDetailsCoreData={coreData} />
            </ErrorBoundary>
          );
        }
        break;
      default:
        return <></>;
    }
  }
  return <></>;
};

export default Renderer;
