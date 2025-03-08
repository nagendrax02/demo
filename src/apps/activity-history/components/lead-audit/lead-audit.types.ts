import {
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { IAuditData } from '../../types';
import { EntityType } from 'common/types';

export interface IComponent {
  leadRepresentationName?: IEntityRepresentationName;
  auditData?: IAuditData;
  auditComment?: string;
  newValue?: string;
  changedById?: string;
  prospectAuditId?: string;
  type?: EntityType;
  repName?: string;
  entityDetailsCoreData?: IEntityDetailsCoreData;
}

export interface IAccount {
  name: string;
  id: string;
}
