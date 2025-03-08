import {
  IAugmentedAttributeFields,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import styles from './content.module.css';
import { Value } from 'apps/entity-details/components/properties';
import { DataType, IEntityProperty, RenderType } from 'common/types/entity/lead/metadata.types';
import { Suspense } from 'react';
import DownloadFiles from 'apps/entity-attribute-details/components/download-files/DownloadFiles';
import { getEntityId } from 'common/utils/helpers';
import { CallerSource } from 'src/common/utils/rest-client';

interface IField {
  field: IAugmentedAttributeFields;
  coreData?: IEntityDetailsCoreData;
}

const containsFile = (data: IAugmentedAttributeFields[]): boolean => {
  const fileFieldIndex = data?.findIndex(
    (item) =>
      (item.dataType === DataType.File || item.fieldRenderType === RenderType.File) &&
      item?.value == 'View Files'
  );

  return fileFieldIndex > -1;
};

const RenderField = ({ field, coreData }: IField): JSX.Element => {
  return (
    <div className={styles.field}>
      <div className={styles.name}>{field?.name}</div>

      <div className={styles.value}>
        <Suspense fallback={<></>}>
          <Value
            property={field as IEntityProperty}
            fields={{}}
            callerSource={CallerSource.ActivityHistoryDynamicFormSubmission}
            entityDetailsCoreData={coreData}
          />
        </Suspense>
      </div>
    </div>
  );
};

// eslint-disable-next-line complexity
const Field = ({ field, coreData }: IField): JSX.Element => {
  const cfsFields = field?.cfsFields || [];
  return (
    <>
      {cfsFields.length ? (
        <div className={styles.cfs_container}>
          <div className={styles.cfs_name}>
            <div>{field?.name}</div>
            {containsFile(cfsFields) ? (
              <DownloadFiles
                leadId={getEntityId() || coreData?.entityIds?.lead || ''}
                entityId={field?.entityId || ''}
                parentSchemaName={field?.schemaName || ''}
                data={cfsFields}
                customStyleClass={styles.download_files}
                isActivity
              />
            ) : null}
          </div>
          <div className={`${styles.container} ${styles.margin_bottom}`}>
            {cfsFields?.map((cfsField) => (
              <RenderField key={cfsField?.id} field={cfsField} coreData={coreData} />
            ))}
          </div>
        </div>
      ) : (
        <RenderField field={field} coreData={coreData} />
      )}
    </>
  );
};

export default Field;
