import styles from './list-details-info.module.css';
import { classNames as cn } from 'common/utils/helpers/helpers';
import Badge from '@lsq/nextgen-preact/v2/badge';
import { LIST_TYPE_MAPPING, ListType } from 'apps/smart-views/smartviews.types';
import { getBadgeStateMap } from '../../utils';
import { IListDetails } from '../list-details.types';

const ListTypeBadge = ({
  title,
  listDetails
}: {
  title?: string;
  listDetails?: IListDetails;
}): JSX.Element => {
  return (
    <div className={styles.info_modal_header}>
      {title ? (
        <div className={styles.info_modal_title} title={title}>
          {title}
        </div>
      ) : null}
      <Badge
        size="sm"
        status={getBadgeStateMap(LIST_TYPE_MAPPING[listDetails?.ListType.toString() ?? '0'])}
        customStyleClass={cn(
          Number(listDetails?.ListType ?? '0') === ListType.REFRESHABLE
            ? styles.list_type_refreshable_list
            : '',
          styles.list_type_label,
          'ng_d_0_m'
        )}>
        {LIST_TYPE_MAPPING[listDetails?.ListType.toString() ?? '0']}
      </Badge>
    </div>
  );
};

export default ListTypeBadge;
