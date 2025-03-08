import SmartViewTab from '../../smartview-tab/SmartViewTab';
import useManageLists from './useManageLists';
import useManageListStore from './manage-lists.store';
import { ScheduleEmail } from 'common/component-lib/send-email';
import { CallerSource } from 'common/utils/rest-client';
import styles from './manage-list.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import ActionSummary from './ActionSummary';
import SmartViewsShimmer from 'apps/smart-views/SmartviewsShimmer';

const ManageListsTab = (): JSX.Element => {
  const { tabData, activeTabId } = useManageLists();
  const { showScheduleEmail, record, resetManageListStore, actionSummary } = useManageListStore();

  return tabData ? (
    <div className={classNames(styles.tab_container, 'ng_v2_style')}>
      <div className={styles.tab_sub_container}>
        <SmartViewTab tabData={tabData} tabId={activeTabId} />
      </div>
      {showScheduleEmail ? (
        <ScheduleEmail
          handleClose={() => {
            resetManageListStore();
          }}
          leadId={record?.id || ''}
          leadRepresentationName={record?.Name || ''}
          leadName={record?.Name || ''}
          callerSource={CallerSource.ManageLists}
          type={6}
        />
      ) : null}
      {actionSummary?.isFailure ? <ActionSummary /> : null}
    </div>
  ) : (
    <SmartViewsShimmer loadOnlyGrid />
  );
};

export default ManageListsTab;
