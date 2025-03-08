import styles from './lead-sh.module.css';
import { Suspense, useEffect } from 'react';
import LeadShareTimeline from './components';
import TimelineShimmer from '@lsq/nextgen-preact/timeline/timeline-shimmer';
import { TimelineGroup } from 'common/component-lib/timeline';
import { TimelineGroupShimmer } from '@lsq/nextgen-preact/timeline/timeline-group';
import useLeadShareStore, { getLeadShareRecords } from './lead-sh.store';
import { ILeadShareRecord } from './lead-sh.types';
import { keys } from './constants';
import LeadShareFilters from './components/LSHFilters';
import EmptyState from 'common/component-lib/empty-state';
import { IEntityDetailsCoreData } from '../entity-details/types/entity-data.types';

export interface ILeadShareHistory {
  entityDetailsCoreData: IEntityDetailsCoreData;
}

const LeadShareHistory = (props: ILeadShareHistory): JSX.Element => {
  const { entityDetailsCoreData } = props;
  const { prospectAutoId, entityDetailsType, entityRepNames } = entityDetailsCoreData;

  const primaryRepName = entityRepNames?.[entityDetailsType];
  const { records, loading, status, selectedUser } = useLeadShareStore((state) => ({
    records: state.records,
    loading: state.loading,
    status: state.status,
    selectedUser: state.selectedUser
  }));

  useEffect(() => {
    (async (): Promise<void> => {
      if (prospectAutoId) {
        getLeadShareRecords({
          leadAutoId: prospectAutoId,
          status: status.value,
          selectedUser: selectedUser.value
        });
      }
    })();
  }, [prospectAutoId, status, selectedUser]);

  const itemContent = (data: ILeadShareRecord): JSX.Element => (
    <Suspense key={data.Id} fallback={<TimelineShimmer />}>
      <LeadShareTimeline data={data} coreData={entityDetailsCoreData} />
    </Suspense>
  );

  return (
    <>
      <LeadShareFilters />
      <div className={styles.lead_share_container}>
        {loading ? <TimelineGroupShimmer /> : null}
        {!loading && records.length ? (
          <TimelineGroup<ILeadShareRecord>
            records={records}
            recordIdentifierPropKey={keys.Id}
            groupPropKey={keys.Timestamp}
            itemContent={itemContent}
          />
        ) : (
          <div className={styles.empty_state_container}>
            <EmptyState title={`No ${primaryRepName.SingularName} Share History found!`} />
          </div>
        )}
      </div>
    </>
  );
};

export default LeadShareHistory;
