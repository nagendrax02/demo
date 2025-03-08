import {
  useSmartViewPrimaryHeader,
  useIsGridInitialized,
  useSmartViewTab
} from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import Info from '../info';
import styles from './primary-header.module.css';
import { isManageTab, isSmartviewTab } from 'apps/smart-views/utils/utils';
import { isMiP } from 'common/utils/helpers';
import HeaderActions from '../header-actions';
import Refresh from '../refresh';
import { classNames } from 'common/utils/helpers/helpers';
import { ErrorPageTypes } from 'common/component-lib/error-page/error-page.types';
import { showHeaderActions } from '../../error/error-utils';
import HeaderIcon from '../header-icon';

export interface IProps {
  tabId: string;
  error?: ErrorPageTypes;
  setErrorPage: React.Dispatch<React.SetStateAction<ErrorPageTypes | undefined>>;
}

const PrimaryHeader = (props: IProps): JSX.Element => {
  const { tabId, error, setErrorPage } = props;
  const primaryHeaderConfig = useSmartViewPrimaryHeader(tabId) || {};
  const {
    tabSettings,
    type,
    entityCode = '',
    leadTypeConfiguration
  } = useSmartViewTab(tabId) || {};
  const {
    title,
    customTitle: CustomTitle,
    onRefreshComponent,
    autoRefreshTime,
    canHide
  } = primaryHeaderConfig;
  const isGridInitialized = useIsGridInitialized();

  const getCustomStyle = (): string => {
    return isMiP() && isManageTab(tabId) ? styles.primary_header_mip : '';
  };

  const showInfo = (): boolean => isSmartviewTab(tabId) && !tabSettings?.disableTabInfo;
  const showRefresh = (): boolean | number =>
    isGridInitialized && autoRefreshTime && !tabSettings?.disableAutoRefresh;

  const renderRefresh = (): JSX.Element | null =>
    showRefresh() ? <Refresh error={error} onRefreshComponent={onRefreshComponent} /> : null;

  const renderHeaderActions = (): JSX.Element | null =>
    showHeaderActions(error) ? <HeaderActions tabId={tabId} setErrorPage={setErrorPage} /> : null;

  return (
    <>
      {canHide ? null : (
        <div className={styles.primary_header}>
          {CustomTitle ? (
            CustomTitle()
          ) : (
            <h1 className={`${styles.header_title} ${getCustomStyle} .ng_h_2_b`} title={title}>
              <HeaderIcon tabId={tabId} type={type} entityCode={entityCode} />
              <span className={classNames(styles.title, 'ng_h_2_b')} title={title}>
                {title}
              </span>
            </h1>
          )}
          {showInfo() ? (
            <Info
              primaryHeaderConfig={primaryHeaderConfig}
              tabSettings={tabSettings}
              tabType={type}
              entityCode={entityCode}
              leadTypeConfiguration={leadTypeConfiguration}
              tabId={tabId}
            />
          ) : null}
          {renderRefresh()}
          {renderHeaderActions()}
        </div>
      )}
    </>
  );
};

export default PrimaryHeader;
