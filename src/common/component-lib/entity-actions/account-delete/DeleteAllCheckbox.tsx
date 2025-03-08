import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import Checkbox from '@lsq/nextgen-preact/checkbox';
import { IGridConfig } from './delete.type';
import { getRepName } from './utils';
import style from './style.module.css';

const DeleteAllCheckbox = ({
  deleteAll,
  setDeleteAll,
  gridConfig,
  repName
}: {
  deleteAll: boolean;
  setDeleteAll: (data: boolean) => void;
  repName: IEntityRepresentationName;
  gridConfig: IGridConfig;
}): JSX.Element => {
  return (
    <div
      className={style.delete_all}
      onClick={() => {
        setDeleteAll(!deleteAll);
      }}>
      <Checkbox checked={deleteAll} changeSelection={setDeleteAll} />
      {`Delete all ${gridConfig?.totalRecords} ${getRepName(
        repName,
        gridConfig?.totalRecords
      )} across ${gridConfig?.totalPages} ${getRepName(
        {
          PluralName: 'Pages',
          SingularName: 'Page'
        },
        gridConfig?.totalPages
      )}`}
    </div>
  );
};

export default DeleteAllCheckbox;
