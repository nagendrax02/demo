import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { getRepName } from './utils';
import Shimmer from '@lsq/nextgen-preact/shimmer';
import DeleteAllCheckbox from './DeleteAllCheckbox';
import styles from './style.module.css';
import { IDescription } from './delete.type';
import { fetchRepresentationName } from 'common/utils/entity-data-manager/lead/metadata';
import { CallerSource } from 'common/utils/rest-client';

const Description = ({
  isDeleteDisabled,
  entityIds,
  repName,
  isLoading,
  deleteAll,
  setDeleteAll,
  gridConfig,
  showAsyncRegMsg
}: IDescription): JSX.Element => {
  const [leadRepName, setLeadRepName] = useState<IEntityRepresentationName>({
    PluralName: 'Leads',
    SingularName: 'Lead'
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const res = await fetchRepresentationName(CallerSource.AccountDelete);
        if (res) setLeadRepName(res);
      } catch (error) {
        trackError(error);
      }
    })();
  }, []);

  // eslint-disable-next-line complexity
  const getContent = (): JSX.Element => {
    if (isLoading) {
      return <Shimmer width="100%" height="32px" />;
    }

    if (showAsyncRegMsg) {
      return (
        <>
          Your bulk update request has been queued. You will be notified when the process is
          complete.
        </>
      );
    }
    return (
      <div>
        <div className={styles.disc_header}>
          {isDeleteDisabled
            ? `Please delete all the associated ${leadRepName?.PluralName} with ${getRepName(
                repName,
                entityIds?.length
              )} to proceed further`
            : `Are you sure you want to delete ${
                (entityIds?.length || 0) > 1
                  ? `these ${entityIds?.length || 0} ${repName?.PluralName}`
                  : `this ${repName?.SingularName}`
              }? This action cannot be undone.`}
        </div>

        {gridConfig?.isSelectAll && !isDeleteDisabled ? (
          <div className={styles.delete_all_checkbox_container}>
            <DeleteAllCheckbox
              setDeleteAll={setDeleteAll}
              deleteAll={deleteAll}
              gridConfig={gridConfig}
              repName={repName}
            />
          </div>
        ) : null}
        {(entityIds?.length || 0) > 1 ? (
          <div>{`Note: ${repName?.SingularName} containing ${leadRepName?.PluralName} will not be deleted.`}</div>
        ) : null}
      </div>
    );
  };

  return <>{getContent()}</>;
};

Description.defaultProps = {
  gridConfig: undefined
};
export default Description;
