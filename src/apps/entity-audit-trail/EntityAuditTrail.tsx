import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import Filters from './filters';
import useEntityAuditTrail from './use-entity-audit-trail';
import Grid from './grid';
import NavButtons from './nav-buttons';

export interface IEntityAuditTrail {
  entityCoreData: IEntityDetailsCoreData;
}

const EntityAuditTrail = (props: IEntityAuditTrail): JSX.Element => {
  const { entityCoreData } = props;
  useEntityAuditTrail({ entityCoreData });

  return (
    <div>
      <Filters />
      <Grid />
      <NavButtons />
    </div>
  );
};

export default EntityAuditTrail;
