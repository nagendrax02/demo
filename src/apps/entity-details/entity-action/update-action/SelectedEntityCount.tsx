import styles from './Update.module.css';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';
import { EntityType } from 'common/types';

const SelectedEntityCount = ({
  entityDetailsType,
  selectedEntityCount,
  entityDetailsCoreData
}: {
  entityDetailsType: EntityType;
  entityDetailsCoreData: IEntityDetailsCoreData;
  selectedEntityCount?: number;
}): JSX.Element | null => {
  return (
    <>
      {entityDetailsType === EntityType.Account && (selectedEntityCount || 0) > 1 ? (
        <div className={styles.entity_count}>{`${selectedEntityCount} ${entityDetailsCoreData
          .entityRepNames?.[entityDetailsCoreData.entityDetailsType].PluralName} Selected`}</div>
      ) : null}
    </>
  );
};

SelectedEntityCount.defaultProps = {
  selectedEntityCount: 0
};

export default SelectedEntityCount;
