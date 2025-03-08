import { useState } from 'react';
import { IListAction, IResults } from './list-action.types';
import { Variant } from '@lsq/nextgen-preact/button/button.types';
import styles from './list-action.module.css';
import { trackError } from 'common/utils/experience';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { getRowActionMessage, handleBulkOperation, handleSuccess } from './utils';
import { SUB_HEADINGS, OPERATIONS, HEADINGS, API, DESCRIPTIONS, SUCCESS_BUTTON } from './constant';
import { ACTION } from 'apps/entity-details/constants';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import ConfirmationModal from '@lsq/nextgen-preact/modal/confirmation-modal';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

const getBodyInfo = ({
  entityIds,
  records,
  isBulkOperation,
  actionType,
  leadRepresentationName
}: {
  entityIds: string[];
  records: IRecordType[];
  actionType: string;
  isBulkOperation?: boolean;
  leadRepresentationName?: IEntityRepresentationName;
}): JSX.Element => {
  const entityIdsMap = new Map(entityIds?.map((value) => [value, value]));

  const filteredNames = records
    ?.filter((item) => entityIdsMap.get(item.id))
    ?.map((item) => item?.Name);

  if (isBulkOperation) {
    return (
      <div>
        <div className={styles.heading}>{SUB_HEADINGS[actionType]}</div>
        <div className={styles.body}>
          {filteredNames?.map((name) => (
            <div key={name} className={styles.name_container}>
              <div className={styles.marker}></div>
              <div className={styles.identifier}>{name}</div>
            </div>
          ))}
        </div>
        {actionType === ACTION.ListBulkDelete ? (
          <div className={styles.heading}>
            {`Note : Deleting the list does not delete ${
              leadRepresentationName?.PluralName ?? 'Leads'
            }`}
            .
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div>
      <div className={styles.heading}>
        {SUB_HEADINGS[actionType]?.replace('{listName}', `'${filteredNames?.[0] ?? 'list'}'`)}
      </div>
      <div className={styles.description}>{DESCRIPTIONS[actionType]}</div>
    </div>
  );
};

const ListAction = (props: IListAction): JSX.Element => {
  const {
    entityIds,
    handleClose,
    onSuccess,
    records,
    isBulkOperation,
    actionType,
    leadRepresentationName
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const { setNotification } = useNotificationStore();

  const handleAction = async (): Promise<void> => {
    try {
      Promise.allSettled(
        entityIds?.map((id) => {
          return httpPost({
            path: API[actionType],
            module: Module.Marvin,
            body: {
              ListIds: [id],
              Operation: OPERATIONS[actionType]
            },
            callerSource: CallerSource.ManageLists
          });
        })
      )
        .then((results) => {
          setIsLoading(true);
          if (isBulkOperation) {
            handleBulkOperation({
              results: results as unknown as IResults[],
              records,
              entityIds,
              setNotification,
              handleClose,
              actionType,
              onSuccess
            });
          } else {
            if ((results as unknown as IResults[])?.[0]?.status === 'fulfilled') {
              const isFailure = !(results as unknown as IResults[])?.[0]?.value?.[0]?.IsSuccessful;
              handleSuccess({
                setNotification,
                actionType,
                listCount: entityIds?.length,
                listName: records?.[0]?.Name || '',
                failure: isFailure,
                message: getRowActionMessage(isFailure, records, results as unknown as IResults[])
              });

              if (!isFailure) {
                onSuccess?.();
              }

              handleClose();
            } else {
              setNotification({
                type: Type.ERROR,
                message: ERROR_MSG.generic
              });
            }
          }
        })
        .catch((error) => {
          setNotification({
            type: Type.ERROR,
            message: ERROR_MSG.generic
          });
          setIsLoading(false);
          trackError(error);
        });
    } catch (error) {
      setNotification({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
      setIsLoading(false);
      trackError(error);
    }
  };

  return (
    <div>
      <ConfirmationModal
        onClose={handleClose}
        show
        title={HEADINGS[actionType]}
        description={getBodyInfo({
          entityIds,
          records,
          isBulkOperation,
          actionType,
          leadRepresentationName
        })}
        customStyleClass={styles.model_container}
        buttonConfig={[
          {
            id: 1,
            name: SUCCESS_BUTTON[actionType],
            variant: Variant.Primary,
            onClick: handleAction,
            showSpinnerOnClick: true,
            isDisabled: isLoading
          },
          {
            id: 2,
            name: 'Cancel',
            variant: Variant.Secondary,
            onClick: handleClose
          }
        ]}
      />
    </div>
  );
};

export default ListAction;
