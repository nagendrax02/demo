import { ReactNode } from 'react';
import { IRecordType } from '../../smartview-tab/smartview-tab.types';
import styles from './associated-entity.module.css';
import { LeadIdentifier } from '../LeadIdentifier';
import AssociatedOppIdentifier from './AssociatedOppIdentifier';
import { getAssociatedLeadId, getAssociatedOppName } from '../utils';
import { classNames, isValidGUID } from 'src/common/utils/helpers/helpers';
import { BadgeSize } from '@lsq/nextgen-preact/v2/badge/badge.types';

export interface IAssociatedEntity {
  record: IRecordType;
  disableFullScreen?: boolean;
  customStyle?: string;
  badgeSize?: BadgeSize;
}

const AssociatedEntity = ({
  record,
  disableFullScreen,
  customStyle,
  badgeSize
}: IAssociatedEntity): ReactNode => {
  const associatedLeadId = isValidGUID(getAssociatedLeadId(record) ?? '');

  return (
    <div className={classNames(styles.entity_name_container, customStyle)}>
      {getAssociatedOppName(record) ? (
        <div
          className={styles.associated_opp}
          style={{ maxWidth: associatedLeadId ? '70%' : '100%' }}>
          <AssociatedOppIdentifier
            record={record}
            disableFullScreen={disableFullScreen}
            badgeSize={badgeSize}
          />
        </div>
      ) : null}

      {associatedLeadId ? (
        <LeadIdentifier
          record={record}
          isAssociatedEntity
          customStyle={classNames(
            styles.associated_entity_name,
            styles.lead_identifier,
            getAssociatedOppName(record) ? styles.hide_lead_name : ''
          )}
          disableFullScreen={disableFullScreen}
          badgeSize={badgeSize}
        />
      ) : null}
    </div>
  );
};

AssociatedEntity.defaultProps = {
  disableFullScreen: false,
  customStyle: '',
  badgeSize: 'sm',
  columnDef: undefined
};
export default AssociatedEntity;
