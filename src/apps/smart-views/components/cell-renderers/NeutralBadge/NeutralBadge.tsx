import { IRecordType } from '../../smartview-tab/smartview-tab.types';
import { ReactNode } from 'react';
import styles from './neutral-badge.module.css';
import { EntityType } from 'common/types';
import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import Badge from '@lsq/nextgen-preact/v2/badge';
import {
  ACCOUNT_SCHEMA_PREFIX,
  leadSchemaNamePrefix,
  SCHEMA_NAMES
} from 'apps/smart-views/constants/constants';

export interface INeutralBadge {
  record: IRecordType;
  columnDef: IColumnDef<IRecordType> & { entityType: EntityType };
}

const getBadgeText = (entityType: EntityType, record: IRecordType): string | null => {
  let badgeText: string | null = '';
  if (entityType === EntityType.Activity || entityType === EntityType.AccountActivity) {
    badgeText = record.Status;
  } else if (entityType === EntityType.Lead) {
    badgeText =
      record[SCHEMA_NAMES.PROSPECT_STAGE] ??
      record[leadSchemaNamePrefix + SCHEMA_NAMES.PROSPECT_STAGE];
  } else if (entityType === EntityType.Account) {
    badgeText = record[SCHEMA_NAMES.STAGE] ?? record[ACCOUNT_SCHEMA_PREFIX + SCHEMA_NAMES.STAGE];
  }
  return badgeText;
};

const NeutralBadge = ({ record, columnDef }: INeutralBadge): ReactNode => {
  if (!columnDef?.entityType) return null;

  const badgeText = getBadgeText(columnDef?.entityType, record);

  if (!badgeText) return null;

  return (
    <Badge size="sm" status="neutral" customStyleClass={styles.badge}>
      <span className={styles.ellipsis} title={badgeText}>
        {badgeText}
      </span>
    </Badge>
  );
};

export default NeutralBadge;
