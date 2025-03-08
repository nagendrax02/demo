import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { IMetaDataConfig } from '../../../types';
import Property from './Property';
import Value from './Value';
import styles from './metadata.module.css';
import { EntityType } from 'common/types';

interface IField {
  field: IMetaDataConfig;
  coreData?: IEntityDetailsCoreData;
  fieldValues?: Record<string, string>;
}

const Field = ({ field, coreData, fieldValues }: IField): JSX.Element => {
  return (
    <span className={styles.field}>
      <Property field={field} />
      <Value
        field={field}
        coreData={coreData}
        fieldValues={fieldValues}
        associatedEntityDetails={
          fieldValues?.isOpportunity
            ? {
                entityId: fieldValues?.ProspectActivityId ?? '',
                entityType: EntityType.Opportunity,
                entityCode: fieldValues?.ActivityEvent ?? '',
                entityName: fieldValues?.mx_Custom_1 ?? ''
              }
            : undefined
        }
      />
    </span>
  );
};

Field.defaultProps = {
  coreData: {},
  fieldValues: undefined
};

export default Field;
