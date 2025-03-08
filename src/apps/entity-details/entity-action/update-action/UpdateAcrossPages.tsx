import Checkbox from '@lsq/nextgen-preact/checkbox';
import style from './Update.module.css';
import { IGridConfig } from './update.types';
import { getRepName } from './utils';
import { IEntityRepresentationName } from '../../types/entity-data.types';

const UpdateAcrossPages = ({
  show,
  setUpdateAllPageRecord,
  updateAllPageRecord,
  gridConfig,
  primaryEntityRepName
}: {
  show: boolean;
  primaryEntityRepName: IEntityRepresentationName;
  setUpdateAllPageRecord?: (data: boolean) => void;
  updateAllPageRecord?: boolean;
  gridConfig?: IGridConfig;
}): JSX.Element => {
  return (
    <>
      {show ? (
        <div className={style.update_all}>
          <Checkbox
            checked={updateAllPageRecord || false}
            changeSelection={setUpdateAllPageRecord}
          />
          {`Update all ${gridConfig?.totalRecords} ${getRepName(
            primaryEntityRepName,
            gridConfig?.totalRecords
          )} across ${gridConfig?.totalPages} ${getRepName(
            { PluralName: 'Pages', SingularName: 'Page' },
            gridConfig?.totalPages
          )}`}
        </div>
      ) : null}
    </>
  );
};

UpdateAcrossPages.defaultProps = {
  show: false,
  setUpdateAllPageRecord: undefined,
  updateAllPageRecord: false,
  gridConfig: undefined
};
export default UpdateAcrossPages;
