import Icon from '@lsq/nextgen-preact/icon';
import { IMetaDataConfig } from '../../../types';
import styles from './metadata.module.css';
import { isMobileDevice } from 'common/utils/helpers';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import Field from './Field';
import { RenderType } from 'common/types/entity/lead';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';

interface IMetaData {
  isLoading: boolean;
  coreData?: IEntityDetailsCoreData;
  config: IMetaDataConfig[] | undefined;
  fieldValues?: Record<string, string>;
}

const MetaData = ({ config, coreData, fieldValues }: IMetaData): JSX.Element => {
  const isMobile = isMobileDevice();

  const isFullRow = (renderType: string): boolean => {
    if (isMobile && renderType !== RenderType.SocialMedia) {
      return true;
    }
    return false;
  };

  const getSeperator = (
    field: IMetaDataConfig,
    index: number,
    array: IMetaDataConfig[]
  ): JSX.Element => {
    if (!field?.hideSeperator && !isMobile && index < array.length - 1 && array[index + 1]) {
      return (
        <Icon
          name="fiber_manual_record"
          customStyleClass={styles.seperator}
          variant={IconVariant.Filled}
        />
      );
    }
    return <></>;
  };

  if (config) {
    return (
      <div className={isMobile ? styles.wrapper_mobile : styles.wrapper_web}>
        {config?.map((field, index, array) => {
          return (
            <div
              key={field.SchemaName}
              className={`${styles.field_wrapper} ${
                isFullRow(field.RenderType) ? styles.full_row : null
              }`}>
              <Field coreData={coreData} field={field} fieldValues={fieldValues} />
              {getSeperator(field, index, array)}
            </div>
          );
        })}
      </div>
    );
  }

  return <></>;
};

MetaData.defaultProps = {
  fieldValues: undefined
};

export default MetaData;
