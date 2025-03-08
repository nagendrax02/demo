import Badge from '@lsq/nextgen-preact/v2/badge';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { LIST_TYPE_MAPPING, ListType } from 'apps/smart-views/smartviews.types';
import style from './manage-list.module.css';
import { getBadgeStateMap } from '../utils';

const getRenderContent = ({ record }: { record: IRecordType }): string => {
  const listType = record?.ListType as unknown as ListType;
  return listType ? LIST_TYPE_MAPPING[listType] : LIST_TYPE_MAPPING[ListType.STATIC];
};

const ListTypeRenderer = ({ record }: { record: IRecordType }): JSX.Element => {
  const listType = getRenderContent({ record });
  return (
    <Badge
      size="sm"
      status={getBadgeStateMap(listType)}
      customStyleClass={
        listType === LIST_TYPE_MAPPING[ListType.REFRESHABLE] ? style.list_type_refreshable_list : ''
      }>
      {getRenderContent({ record })}
    </Badge>
  );
};

export default ListTypeRenderer;
