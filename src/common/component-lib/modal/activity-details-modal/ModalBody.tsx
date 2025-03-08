import { ActivityBaseAttributeDataType } from 'src/common/types/entity/lead';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import styles from './activity-details-modal.module.css';
import { IActivityFields } from './activity-details.types';
import FieldRenderer from './FieldRenderer';
import EmptyState from '../../empty-state';
import { activtyNotFound } from './constants';
import { CallerSource } from 'src/common/utils/rest-client';

interface IModalBody {
  activityFields: IActivityFields[];
  loading: boolean;
  activityId: string;
  callerSource: CallerSource;
  leadId?: string;
  entityId?: string;
  isActivityHistory?: boolean;
}

const ModalBody = ({
  activityFields,
  loading,
  activityId,
  isActivityHistory,
  callerSource,
  leadId,
  entityId
}: IModalBody): JSX.Element => {
  const renderField = (field: IActivityFields, cfsField?: IActivityFields): JSX.Element => (
    <div className={styles.field_container} key={field.SchemaName}>
      <div className={styles.label}>{field.DisplayName}</div>
      <FieldRenderer
        property={field}
        leadId={leadId}
        entityId={entityId}
        activityId={activityId}
        cfsSchemaName={cfsField?.SchemaName}
        callerSource={callerSource}
        preventDuplicateFiles
      />
    </div>
  );

  return (
    <div>
      {loading ? (
        <>
          {Array.from({ length: 3 }, (item, index) => (
            <div
              data-testid={`shimmer-${index}`}
              key={Math.random()}
              className={styles.shimmer_row}>
              <Shimmer height="20px" width="200px" />
              <Shimmer height="20px" width="300px" />
            </div>
          ))}
        </>
      ) : (
        <>
          {activityFields?.length ? (
            activityFields?.map((field) => {
              if (isActivityHistory && !field?.ShowInForm) {
                return null;
              }
              if (field?.DataType !== ActivityBaseAttributeDataType.CustomObject) {
                return renderField(field);
              }
              return (
                <>
                  <div className={styles.cfs_field}>{field.DisplayName}</div>
                  <div key={field.SchemaName} className={styles.cfs_container}>
                    {field.Fields?.map((item) => renderField(item, field))}
                  </div>
                </>
              );
            })
          ) : (
            <div className={styles.empty_state_container}>
              <EmptyState
                title={activtyNotFound.title}
                descriptionText={activtyNotFound.description}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

ModalBody.defaultProps = {
  isActivityHistory: false,
  leadId: undefined,
  entityId: undefined
};

export default ModalBody;
