import { PrimaryHeader, SearchAndFilter } from './components';
import styles from './smartviews-tab.module.css';
import SmartviewGrid from './components/grid/SmartviewsGrid';
import { ITabConfig } from './smartview-tab.types';
import CalendarView from '../external-components/calendar-view';
import { isCalendarViewActive } from './utils';
import { IGetIsFeatureRestriction } from '../../smartviews.types';
import { showSearchAndFilters } from './components/error/error-utils';
import { useState } from 'react';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';

interface ISmartViewTab {
  tabId: string;
  tabData: ITabConfig;
  featureRestriction?: IGetIsFeatureRestriction | null;
}

const SmartViewTab = (props: ISmartViewTab): JSX.Element => {
  const { tabId, tabData, featureRestriction } = props;
  const [error, setError] = useState<ErrorPageTypes | undefined>(undefined);

  console.log('error', error);

  return (
    <div className={styles.smartview_tab}>
      <div>
        <PrimaryHeader tabId={tabId} error={error} setErrorPage={setError} />
        <div className={styles.secondary_header}>
          {showSearchAndFilters(error) ? <SearchAndFilter tabId={tabId} tabData={tabData} /> : null}
        </div>
      </div>
      {isCalendarViewActive(tabData) ? (
        <CalendarView tabData={tabData} key={tabData?.id} />
      ) : (
        <SmartviewGrid
          featureRestriction={featureRestriction}
          tabId={tabId}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};

SmartViewTab.defaultProps = {
  tabId: '',
  tabData: {},
  featureRestriction: {}
};

export default SmartViewTab;
