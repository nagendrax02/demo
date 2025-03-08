import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';
import ActivityHistory from './ActivityHistory';
import { AHStoreProvider } from './activity-history.store';
import { IEntityDetailsCoreData, TabType } from '../entity-details/types/entity-data.types';
import { IEntityIds } from '../entity-details/types/entity-store.types';
import { getTabDetailId } from 'common/utils/helpers/helpers';

interface IActivityHistoryRoot {
  type: EntityType;
  entityDetailsCoreData: IEntityDetailsCoreData;
  tabType?: TabType;
  getData?: () => {
    entityIds: IEntityIds;
    entityType: EntityType;
  };
  customTypeFilter?: IOption[];
}

const ActivityHistoryRoot = (props: IActivityHistoryRoot): JSX.Element => {
  const detailId = getTabDetailId();
  return (
    <AHStoreProvider type={props.type} entityDetailId={detailId}>
      <>
        <ActivityHistory {...props} />
      </>
    </AHStoreProvider>
  );
};

ActivityHistoryRoot.defaultProps = {
  customTypeFilter: undefined,
  isCustomActivityTab: false,
  tabType: undefined,
  getData: null
};

export default ActivityHistoryRoot;
