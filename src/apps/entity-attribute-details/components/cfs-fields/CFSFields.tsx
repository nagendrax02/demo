import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import styles from './cfs-fields.module.css';
import fieldStyles from '../Field/field.module.css';
import { cleanName } from '../utils';
import { Value } from 'apps/entity-details/components/properties';
import { DataType, IEntityProperty, RenderType } from 'common/types/entity/lead/metadata.types';
import DownloadFiles from '../download-files';
import { CallerSource } from 'src/common/utils/rest-client';
import { MASKED_TEXT } from 'common/constants';

interface ICFSFields {
  name: string;
  parentSchemaName: string;
  data: IAugmentedAttributeFields[];
  entityFields: Record<string, string | null> | undefined;
}

const getColSpan = (colSpan: number | undefined): string => {
  return colSpan == 1 ? fieldStyles.col_span_1 : fieldStyles.col_span_2;
};

const getBorder = (colSpan: number, length: number, index: number): string => {
  if ((length - 1 == index || length - 2 === index) && colSpan != 2) {
    return '';
  }
  return styles?.cfs_field_border;
};

const containsFile = (data: IAugmentedAttributeFields[]): boolean => {
  const fileFieldIndex = data?.findIndex(
    (item) =>
      (item.dataType === DataType.File || item.fieldRenderType === RenderType.File) &&
      item?.value !== MASKED_TEXT &&
      item.value
  );

  return fileFieldIndex > -1;
};

const CFSFields = ({ name, parentSchemaName, data, entityFields }: ICFSFields): JSX.Element => {
  const { leadId, entityId, isActivity } = data?.[0] || {};
  return (
    <div className={styles.cfs_fields} data-testid={`cfs-container-${name}`}>
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        {containsFile(data) ? (
          <DownloadFiles
            leadId={entityFields?.ProspectID || leadId || ''}
            data={data}
            entityId={(isActivity ? entityId : entityFields?.ProspectID) ?? ''}
            parentSchemaName={parentSchemaName}
            isActivity={isActivity}
          />
        ) : null}
      </div>
      <div className={styles?.cfs_field}>
        {data?.map((field, index) => {
          const fieldName = cleanName(field?.name);
          return (
            <div
              key={field?.id}
              className={`${getColSpan(field.colSpan)} ${getBorder(
                field?.colSpan || 1,
                data?.length,
                index
              )} ${fieldStyles?.field} ${field?.isMatched ? fieldStyles?.highlight : ''}`}>
              <div className={fieldStyles?.name} data-testid={`${fieldName}-label`}>
                {fieldName}
              </div>
              <div className={fieldStyles?.value} data-testid={`${fieldName}-value`}>
                <Value
                  property={
                    {
                      ...field,
                      parentSchemaName: parentSchemaName,
                      isCFSField: true,
                      preventAlignment: true
                    } as IEntityProperty
                  }
                  preventDuplicateFiles
                  fields={entityFields}
                  entityConfig={{}}
                  callerSource={CallerSource.EntityAttributeDetails}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CFSFields;
