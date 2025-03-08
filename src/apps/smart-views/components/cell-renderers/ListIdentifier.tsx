import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import styles from './cell-renderer.module.css';
import {
  setManageListSelectedRecordId,
  setShowScheduleEmail
} from '../custom-tabs/manage-lists/manage-lists.store';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { ListType } from '../../smartviews.types';
import { APP_ROUTE } from 'common/constants';
import { classNames } from 'common/utils/helpers/helpers';
import { EmailSchedule } from 'assets/custom-icon/v2';
import { getActiveTab, getTabData } from '../smartview-tab/smartview-tab.store';

const ListIdentifier = ({ record }: { record: IRecordType }): JSX.Element => {
  const activeTab = getActiveTab();
  const leadType = getTabData(activeTab)?.gridConfig?.fetchCriteria?.LeadType;

  const getListName = (): JSX.Element => {
    let url = `${APP_ROUTE.listDetails}?listID=${record?.id ?? ''}&listType=${
      record?.ListType ?? ListType.STATIC
    }`;
    if (leadType) {
      url = `${url}&leadType=${leadType ?? ''}`;
    }
    return (
      <a href={url} title={record?.Name ?? ''}>
        {record?.Name}
      </a>
    );
  };

  const handleEmailCountClick = (): void => {
    setManageListSelectedRecordId(record);
    setShowScheduleEmail(true);
  };

  return (
    <div className={styles.list_identifier_container}>
      <div className={classNames('ng_p_1_sb', styles.entity_identifier)}>{getListName()}</div>
      {record?.ScheduleEmailCount ? (
        <button
          className={styles.list_identifier_email_counter_container}
          onClick={handleEmailCountClick}>
          <Tooltip
            content="View Scheduled Emails"
            placement={Placement.Vertical}
            trigger={[Trigger.Hover]}
            wrapperClass={styles.schedule_tooltip}>
            <>
              <span className={styles.list_identifier_email_count}>
                {Number(record?.ScheduleEmailCount) < 9 ? record?.ScheduleEmailCount : '9+'}
              </span>
              <EmailSchedule type="outline" className={styles.schedule_email} />
            </>
          </Tooltip>
        </button>
      ) : null}
    </div>
  );
};

export default ListIdentifier;
