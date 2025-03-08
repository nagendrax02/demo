import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import styles from './field.module.css';
import CFSFields from '../cfs-fields';
import { cleanName } from '../utils';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { Value } from 'apps/entity-details/components/properties';
import { DataType, IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { CallerSource } from 'src/common/utils/rest-client';

interface IField {
  data: IAugmentedAttributeFields;
}

const getColSpan = (colSpan: number | undefined): string => {
  return colSpan == 1 ? styles.col_span_1 : styles.col_span_2;
};

const Field = ({ data }: IField): JSX.Element => {
  const entityFields = useEntityDetailStore(
    (state) => state?.augmentedEntityData?.attributes?.fields
  );
  const fieldName = cleanName(data?.name);
  return (
    <>
      {!data?.cfsFields?.length && data?.dataType !== DataType.CustomObject ? (
        <div
          data-testid={`${data?.isMatched ? 'highlighted' : ''}`}
          className={`${styles.field} ${styles?.field_border} ${getColSpan(data?.colSpan)} ${
            data?.isMatched ? styles?.highlight : ''
          }`}>
          <div className={styles.name} data-testid={`${fieldName}-label`}>
            {cleanName(data?.name)}
          </div>
          <div className={styles.value} data-testid={`${fieldName}-value`}>
            <Value
              property={{ ...(data as IEntityProperty), preventAlignment: true }}
              fields={entityFields}
              entityConfig={{}}
              callerSource={CallerSource.EntityAttributeDetails}
            />
          </div>
        </div>
      ) : data?.cfsFields?.length ? (
        <CFSFields
          name={data?.name}
          parentSchemaName={data?.schemaName}
          data={data?.cfsFields}
          entityFields={entityFields}
        />
      ) : null}
    </>
  );
};

export default Field;
