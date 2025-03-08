import Header from 'common/component-lib/entity-tabs-header';
import DateFilter from 'common/component-lib/date-filter';
import { IDateOption } from 'common/component-lib/date-filter/date-filter.types';
import { lazy, useEffect, useState } from 'react';
import useNotes from './utils';
import { DefaultNotesPage, NotesTimeline } from './components';
import styles from './notes.module.css';
import useNotesStore from './notes.store';
import { DEFAULT_DATE } from './constants';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { StorageKey, getItem, setItem } from 'common/utils/storage-manager';
import { IEntityIds } from '../entity-details/types/entity-store.types';
import { IEntityRepresentationName } from '../entity-details/types/entity-data.types';
import { EntityType } from 'common/types';

const TimelineGroupShimmer = withSuspense(
  lazy(() =>
    import('@lsq/nextgen-preact/timeline/timeline-group').then((module) => ({
      default: module.TimelineGroupShimmer
    }))
  )
);

export interface INotesProps {
  getData: () => {
    entityType: EntityType;
    entityIds: IEntityIds;
    entityRepName: IEntityRepresentationName;
  };
}

const Notes = (props: INotesProps): JSX.Element => {
  const { getData } = props;
  const { entityIds, entityRepName, entityType } = getData();
  const dateFilterFromLS: IDateOption | null = getItem(StorageKey.NotesDateFilter);
  const [selectedOption, setSelectedOption] = useState<IDateOption>(
    dateFilterFromLS || DEFAULT_DATE
  );

  const { isLoading, notes, intersectionRef, isLoadingNextPage } = useNotes({ entityIds });
  const { setDate, setRefresh } = useNotesStore();

  useEffect(() => {
    setDate({
      startDate: selectedOption?.startDate || '',
      endDate: selectedOption?.endDate || ''
    });
    setItem(StorageKey.NotesDateFilter, selectedOption);
    setRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const renderNotes = (): JSX.Element => {
    return !notes?.length ? (
      <DefaultNotesPage entityIds={entityIds} entityRepName={entityRepName} />
    ) : (
      <NotesTimeline
        notes={notes}
        intersectionRef={intersectionRef}
        isLoadingNextPage={isLoadingNextPage}
        entityIds={entityIds}
        entityType={entityType}
      />
    );
  };

  return (
    <>
      <Header>
        <DateFilter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </Header>
      <div className={styles.notes_layout}>
        {isLoading ? <TimelineGroupShimmer /> : renderNotes()}
      </div>
    </>
  );
};

export default Notes;
