import { useState } from 'react';
import styles from './custom-field-set.module.css';
import { getAugmentedCfsFields, handleDownloadCFSFiles, isContainsFiles } from './utils';
import Spinner from '@lsq/nextgen-preact/spinner';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { Value } from 'apps/entity-details/components/properties';
import { ICustomObjectMetaData } from 'common/types/entity/lead';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { CallerSource } from 'common/utils/rest-client';

export interface ICustomFieldSet {
  property: IEntityProperty;
  value: Record<string, string | number | boolean>;
  fields: Record<string, string | null>;
  leadId: string;
  opportunityId?: string;
  customObjectMetaData?: ICustomObjectMetaData;
  isAssociatedLeadProperty?: boolean;
}

const CustomFieldSet = (props: ICustomFieldSet): JSX.Element => {
  const {
    property,
    value,
    customObjectMetaData,
    leadId,
    opportunityId,
    fields,
    isAssociatedLeadProperty
  } = props;
  const [isDownloadingFiles, setIsDownloadingFiles] = useState<boolean>(false);
  const { showAlert } = useNotification();

  const getCustomObjectFields = (): JSX.Element[] => {
    return (customObjectMetaData?.Fields || [])?.map((customField) => {
      return (
        <div key={customField?.DisplayName} className={styles.field}>
          <div className={styles.field_name}>{customField?.DisplayName}</div>
          <div className={styles.field_value}>
            <Value
              property={getAugmentedCfsFields({
                field: customField,
                value: value?.[customField?.SchemaName],
                parentSchemaName: property?.schemaName,
                leadId,
                opportunityId,
                isAssociatedLeadProperty
              })}
              fields={fields}
              callerSource={CallerSource.OpportunityDetailsProperties}
            />
          </div>
        </div>
      );
    });
  };

  const getHeader = (): JSX.Element => {
    const containsFile = isContainsFiles(customObjectMetaData?.Fields || [], value);
    if (containsFile && containsFile !== 'xxxxx') {
      return (
        <>
          <div>{property?.name}</div>
          {!isDownloadingFiles ? (
            <div
              className={styles.download_files}
              onClick={async () => {
                setIsDownloadingFiles(true);
                await handleDownloadCFSFiles({
                  cfsFieldsData: customObjectMetaData?.Fields || [],
                  schemaName: property?.schemaName,
                  leadId,
                  opportunityId: !isAssociatedLeadProperty ? opportunityId : undefined,
                  showAlert: showAlert
                });
                setIsDownloadingFiles(false);
              }}
              tabIndex={0}>
              <Icon
                name="download_2"
                variant={IconVariant.Filled}
                customStyleClass={styles.download_files_icon}
              />
              <div>Download Files</div>
            </div>
          ) : (
            <div className={`${styles.download_files} ${styles.loading}`}>
              <Icon
                name="download_2"
                variant={IconVariant.Filled}
                customStyleClass={styles.download_files_icon}
              />
              <div className={styles.download_files}>Download Files</div>
              <Spinner customStyleClass={styles.download_files_spinner} />
            </div>
          )}
        </>
      );
    }
    return <div>{property.name}</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>{getHeader()}</div>
      <div className={styles.field_wrapper}>{getCustomObjectFields()}</div>
    </div>
  );
};

CustomFieldSet.defaultProps = {
  customObjectMetaData: undefined,
  opportunityId: undefined,
  isAssociatedLeadProperty: undefined
};

export default CustomFieldSet;
