import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */ // keeping all the action to be rendered in one file or else have separate them
import React, { lazy, useEffect, useState } from 'react';
import { ACTION } from 'apps/entity-details/constants';
import useEntityDetailStore from 'apps/entity-details/entitydetail.store';
import { getEntityId } from 'common/utils/helpers';
import OptOut from 'apps/entity-details/entity-action/opt-out';
import { isRestricted } from 'common/utils/permission-manager';
import { ActionType } from 'common/utils/permission-manager/permission-manager.types';
import CustomActions from 'common/component-lib/custom-actions';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import Delete from 'apps/entity-details/entity-action/delete';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import {
  IActionMenuItem,
  IButtonAction,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import Update from 'apps/entity-details/entity-action/update-action';
import AddToList from 'apps/entity-details/entity-action/add-to-list';
import { getLeadName, getUserId } from 'apps/entity-details/utils';
import SendEmail, { ScheduleEmail } from 'common/component-lib/send-email';
import AutomationReport from 'apps/entity-details/entity-action/automation-report';
import LeadShare from 'apps/entity-details/entity-action/lead-share';
import { CallerSource } from 'common/utils/rest-client';
import { getCallerSource, getOpporunityEmailConfig, getSendEmailToFieldName } from '../utils/utils';
import { createPortal } from 'react-dom';
import { IDeleteActionHandler } from '../../../../types/action-handler.types';
import { DEFAULT_ENTITY_IDS } from 'common/constants';
import AssignLeads from 'apps/entity-details/entity-action/assign-leads';
import { getAccountId, getAccountTypeId, getListId } from 'common/utils/helpers/helpers';
import { PERMISSION_ENTITY_TYPE } from 'apps/smart-views/augment-tab-data/common-utilities/constant';
import Cancel from 'apps/activity-history/components/custom/actions/cancel/Cancel';
import TaskCancel from 'common/component-lib/entity-actions/task-cancel';
import TaskDelete from 'common/component-lib/entity-actions/task-delete';
import MarkTask from 'common/component-lib/entity-actions/mark-task';
import TaskDeleteRecurrence from 'common/component-lib/entity-actions/task-delete-recurrence';
import { TaskActionType } from 'common/component-lib/entity-actions/mark-task/mark-task.type';
import { updateGridDataAfterPause } from 'apps/smart-views/utils/utils';
import { skipAutoRefresh } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import SetPrimaryContact from 'apps/entity-details/entity-action/set-primary-contact';
import { EntityType } from 'common/types';
import { LEAD_SCHEMA_NAME } from 'apps/entity-details/schema-names';
import { alertConfig } from 'apps/tasks/constants';
import AccountDelete from 'common/component-lib/entity-actions/account-delete';
import { updateLeadAndLeadTabs } from 'apps/forms/utils';
import ListAction from 'common/component-lib/entity-actions/list-action';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import ListCreate from 'common/component-lib/entity-actions/list-create/ListCreate';
import { TABS_CACHE_KEYS } from 'apps/smart-views/components/custom-tabs/constants';
import BulkUpdateRenderer from 'apps/smart-views/components/smartview-tab/components/bulk-actions-handler/BulkUpdateRenderer';
import DeleteAllLead from 'apps/entity-details/entity-action/delete-all-lead';

export interface IHandleAction {
  coreData: IEntityDetailsCoreData;
  customConfig?: Record<string, string>;
  action: IActionMenuItem | IButtonAction | null;
  setActionClicked: React.Dispatch<React.SetStateAction<IActionMenuItem | IButtonAction | null>>;
  onSuccess?: () => void;
  isSmartviews?: boolean;
  entityRecords?: Record<string, unknown>[];
  entityName?: string;
}

const AddNotes = withSuspense(lazy(() => import('apps/notes/components/add-notes')));

const HandleAction = (props: IHandleAction): JSX.Element => {
  const {
    action,
    setActionClicked,
    coreData,
    customConfig,
    onSuccess,
    isSmartviews,
    entityRecords,
    entityName
  } = props;
  let fieldValues = useEntityDetailStore((state) => state.augmentedEntityData?.properties?.fields);

  const entityData = useEntityDetailStore((state) => state.augmentedEntityData);

  fieldValues = { ...(fieldValues ?? {}), ...(customConfig ?? {}) };

  const { entityIds, entityRepNames, entityDetailsType } = coreData;

  const { showAlert } = useNotification();

  let entityId = entityIds[entityDetailsType] ?? entityIds?.lead ?? getEntityId();

  if (entityDetailsType === EntityType.Account) {
    entityId = entityIds?.EntityTypeId || '';
  }

  const primaryEntityId = entityIds?.[entityDetailsType];
  const primaryRepName = entityRepNames?.[entityDetailsType];

  const leadRepresentationName = entityRepNames?.lead;

  const [modals, setModals] = useState({
    notes: false,
    delete: false,
    update: false,
    optOut: false,
    markTask: false,
    addToList: false,
    sendEmail: false,
    taskCancel: false,
    taskDelete: false,
    assignLeads: false,
    shareViaEmail: false,
    customActions: false,
    deleteRecurrence: false,
    automationReport: false,
    viewScheduleEmail: false,
    cancelSalesActivity: false,
    setAsPrimaryContact: false,
    accountDelete: false,
    hideList: false,
    listUnhide: false,
    listDelete: false,
    listEdit: false,
    updateAllLead: false,
    deleteAllLead: false,
    removeFromList: false,
    listAddMore: false
  });

  const handleModalToggle = (modalName: string, show: boolean): void => {
    skipAutoRefresh(show);
    setModals((prevModals) => ({ ...prevModals, [modalName]: show }));
  };

  const handleCallAction = async (): Promise<void> => {
    try {
      const module = await import('apps/external-app');
      module.triggerEntityClick2Call({
        fields: fieldValues,
        phoneNumber: fieldValues?.Phone || '',
        schemaName: 'Phone'
      });
    } catch (error) {
      trackError(error);
    }
  };

  const handleConverseClick = async (): Promise<void> => {
    try {
      const module = await import('apps/external-app');
      module.triggerConverse(entityIds?.lead ?? getEntityId(), getLeadName(fieldValues));
    } catch (error) {
      trackError(error);
    }
  };

  const handleClose = (): void => {
    Object.keys(modals).forEach((modal) => {
      handleModalToggle(modal, false);
    });
    setActionClicked(null);
  };

  const getIsTestEmailEnabled = (entityType: string): boolean => {
    return (
      entityType === TABS_CACHE_KEYS.MANAGE_LISTS_TAB ||
      entityType === TABS_CACHE_KEYS.LIST_LEAD_CACHE_KEY ||
      entityType === EntityType.Lists
    );
  };

  const isStageRestricted = async (): Promise<boolean> => {
    const [
      stageRestricted,
      prospectStageRestricted,
      stageViewRestricted,
      prospectStageViewRestricted
    ] = await Promise.all([
      isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.Update,
        entityId,
        schemaName: LEAD_SCHEMA_NAME.STAGE,
        callerSource: CallerSource.LeadDetailsVCard
      }),
      isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.Update,
        entityId,
        schemaName: LEAD_SCHEMA_NAME.PROSPECT_STAGE,
        callerSource: CallerSource.LeadDetailsVCard
      }),
      isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.View,
        entityId,
        schemaName: LEAD_SCHEMA_NAME.STAGE,
        callerSource: CallerSource.LeadDetailsVCard
      }),
      isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.View,
        entityId,
        schemaName: LEAD_SCHEMA_NAME.PROSPECT_STAGE,
        callerSource: CallerSource.LeadDetailsVCard
      })
    ]);

    return (
      stageRestricted ||
      prospectStageRestricted ||
      stageViewRestricted ||
      prospectStageViewRestricted
    );
  };

  const entityAction = {
    [ACTION.OptOut]: (): void => {
      handleModalToggle('optOut', true);
    },
    [ACTION.Note]: (): void => {
      handleModalToggle('notes', true);
    },
    [ACTION.Delete]: async (): Promise<void> => {
      const isRestrict = await isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.Delete,
        entityId,
        callerSource: CallerSource.LeadDetailsVCard
      });
      if (isRestrict) {
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.permission
        });
      } else {
        handleModalToggle('delete', true);
      }
    },
    [ACTION.ChangeStage]: async (): Promise<void> => {
      const isRestrict = await isStageRestricted();
      if (isRestrict) {
        showAlert({
          type: Type.ERROR,
          message: alertConfig.ACCESS_DENIED.message
        });
        setActionClicked(null);
      } else {
        handleModalToggle('update', true);
      }
    },
    [ACTION.SetAsPrimaryContact]: (): void => {
      handleModalToggle('setAsPrimaryContact', true);
    },
    [ACTION.ChangeOwner]: async (): Promise<void> => {
      const isRestrict = await isRestricted({
        entity: PERMISSION_ENTITY_TYPE[entityDetailsType],
        action: ActionType.Update,
        entityId,
        schemaName: LEAD_SCHEMA_NAME.OWNER_ID,
        callerSource: CallerSource.LeadDetailsVCard
      });
      if (isRestrict) {
        showAlert({
          type: Type.ERROR,
          message: alertConfig.ACCESS_DENIED.message
        });
      } else {
        handleModalToggle('update', true);
      }
    },
    [ACTION.Change_Status_Stage]: (): void => {
      handleModalToggle('update', true);
    },
    [ACTION.Call]: async (): Promise<void> => {
      handleCallAction();
      handleClose();
    },
    [ACTION.AddToList]: (): void => {
      handleModalToggle('addToList', true);
    },
    [ACTION.Converse]: async (): Promise<void> => {
      handleConverseClick();
      handleClose();
    },
    [ACTION.ViewScheduledEmail]: (): void => {
      handleModalToggle('viewScheduleEmail', true);
    },
    [ACTION.AutomationReport]: (): void => {
      handleModalToggle('automationReport', true);
    },
    [ACTION.ViewAutomationReportLink]: (): void => {
      handleModalToggle('automationReport', true);
    },
    [ACTION.SendEmailAction]: (): void => {
      handleModalToggle('sendEmail', true);
    },
    [ACTION.ShareViaEmail]: (): void => {
      handleModalToggle('shareViaEmail', true);
    },
    [ACTION.AccountAssignLead]: (): void => {
      handleModalToggle('assignLeads', true);
    },
    [ACTION.Cancel]: (): void => {
      handleModalToggle('cancelSalesActivity', true);
    },
    [ACTION.TaskDelete]: (): void => {
      handleModalToggle('taskDelete', true);
    },
    [ACTION.TaskCancel]: (): void => {
      handleModalToggle('taskCancel', true);
    },
    [ACTION.MarkComplete]: (): void => {
      handleModalToggle('markTask', true);
    },
    [ACTION.MarkOpen]: (): void => {
      handleModalToggle('markTask', true);
    },
    [ACTION.DeleteRecurrence]: (): void => {
      handleModalToggle('deleteRecurrence', true);
    },
    [ACTION.AccountDelete]: (): void => {
      handleModalToggle('accountDelete', true);
    },
    [ACTION.ListHide]: (): void => {
      handleModalToggle('hideList', true);
    },
    [ACTION.ListUnhide]: (): void => {
      handleModalToggle('listUnhide', true);
    },
    [ACTION.ListDelete]: (): void => {
      handleModalToggle('listDelete', true);
    },
    [ACTION.ListEdit]: (): void => {
      handleModalToggle('listEdit', true);
    },
    [ACTION.UpdateAllLead]: (): void => {
      handleModalToggle('updateAllLead', true);
    },
    [ACTION.DeleteAllLead]: (): void => {
      handleModalToggle('deleteAllLead', true);
    },
    [ACTION.RemoveFromList]: (): void => {
      handleModalToggle('removeFromList', true);
    },
    [ACTION.ListAddMore]: (): void => {
      handleModalToggle('listAddMore', true);
    }
  };

  useEffect(() => {
    if (!action) return;
    if (action?.connectorConfig) {
      handleModalToggle('customActions', true);
    } else {
      entityAction[action?.id]?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const getActionType = (): string => {
    if (action?.id === ACTION.ChangeOwner && action?.type === 'Button') return ACTION.ChangeOwner;
    else if (action?.id === ACTION.ChangeStage && action?.type === 'Button')
      return ACTION.ChangeStage;
    else if (action?.id === ACTION.Change_Status_Stage && action?.type === 'Button')
      return ACTION.Change_Status_Stage;
    else if (action?.id === ACTION.ListHide) return ACTION.ListHide;
    else if (action?.id === ACTION.ListUnhide) return ACTION.ListUnhide;
    else if (action?.id === ACTION.ListDelete) return ACTION.ListDelete;
    return action?.id || '';
  };

  const oppEmailConfig = getOpporunityEmailConfig(coreData);

  return (
    <>
      {modals.deleteAllLead
        ? createPortal(
            <DeleteAllLead
              handleClose={handleClose}
              repName={coreData?.entityRepNames?.[coreData?.entityDetailsType]}
            />,
            document.body
          )
        : null}
      {modals.optOut
        ? createPortal(
            <OptOut
              leadId={entityId}
              handleClose={handleClose}
              leadRepresent={leadRepresentationName.SingularName}
            />,
            document.body
          )
        : null}
      {modals.delete || modals.removeFromList
        ? createPortal(
            <Delete
              handleClose={handleClose}
              customConfig={customConfig}
              actionHandler={action?.actionHandler as IDeleteActionHandler}
              onSuccess={modals.removeFromList ? onSuccess : (): void => {}}
              repName={coreData?.entityRepNames?.[coreData?.entityDetailsType]}
            />,
            document.body
          )
        : null}
      {modals.updateAllLead
        ? createPortal(
            <BulkUpdateRenderer
              bulkAction={null}
              tabId={coreData?.tabId as string}
              entityType={EntityType.Lead}
              handleClose={handleClose}
              updateAllEntity
              sourceId={getListId() as string}
            />,
            document.body
          )
        : null}
      {modals.customActions && action?.connectorConfig
        ? createPortal(
            <CustomActions
              entityRecords={entityRecords}
              toggleShow={handleClose}
              connectorConfig={action.connectorConfig}
              callerSource={CallerSource.LeadDetailsVCard}
              entityType={entityDetailsType}
              coreData={coreData}
            />,
            document.body
          )
        : null}
      {modals.notes
        ? createPortal(
            <AddNotes
              showModal={modals.notes}
              onSuccess={onSuccess}
              setShowModal={() => {
                handleClose();
              }}
              entityIds={entityIds || DEFAULT_ENTITY_IDS}
            />,
            document.body
          )
        : null}
      {modals.update
        ? createPortal(
            <Update
              entityId={[
                entityDetailsType === EntityType.Task
                  ? entityIds?.[EntityType.Lead]
                  : primaryEntityId
              ]}
              handleClose={handleClose}
              actionType={getActionType()}
              customConfig={customConfig}
              onSuccess={() => {
                updateGridDataAfterPause();
                onSuccess?.();
              }}
              entityDetailsCoreData={coreData}
              required
            />,
            document.body
          )
        : null}
      {modals.addToList
        ? createPortal(
            <AddToList
              entityIds={[entityId]}
              customConfig={customConfig}
              handleClose={handleClose}
              leadRepresentationName={leadRepresentationName}
              handleSuccess={() => {
                onSuccess?.();
                updateLeadAndLeadTabs();
              }}
              leadTypeInternalName={coreData?.leadType}
            />,
            document.body
          )
        : null}
      {modals.automationReport
        ? createPortal(
            <AutomationReport
              entityType={entityDetailsType}
              handleClose={handleClose}
              entityId={primaryEntityId}
              representationName={primaryRepName?.SingularName || 'Lead'}
            />,
            document.body
          )
        : null}
      {modals.viewScheduleEmail
        ? createPortal(
            <ScheduleEmail
              handleClose={handleClose}
              leadId={entityIds?.lead || entityIds?.lists} //According to ListDetails, ScheduleEmail component that leadId can contain list id as well.
              leadRepresentationName={leadRepresentationName?.SingularName || 'Lead'}
              type={Number(customConfig?.type)}
              leadName={customConfig?.Name ?? ''}
              callerSource={getCallerSource()}
            />,
            document.body
          )
        : null}
      {modals.sendEmail ? (
        <SendEmail
          show
          setShow={handleClose}
          toLead={[
            {
              label:
                entityName ?? getSendEmailToFieldName(entityDetailsType, entityData, fieldValues),
              value: entityIds?.lead || entityIds?.lists
            }
          ]}
          fromUserId={getUserId()}
          leadRepresentationName={leadRepresentationName}
          callerSource={CallerSource.LeadDetailsVCard}
          opportunity={oppEmailConfig}
          leadTypeInternalName={coreData?.leadType}
          enableTestEmailFeature={getIsTestEmailEnabled(entityDetailsType)}
          handleSuccess={
            getIsTestEmailEnabled(entityDetailsType) ? updateGridDataAfterPause : undefined
          }
        />
      ) : null}
      {modals.shareViaEmail ? (
        <LeadShare
          entityId={entityId}
          leadRepName={leadRepresentationName}
          customFieldsConfig={customConfig}
          showModal={modals.shareViaEmail}
          setShowModal={() => {
            handleClose();
          }}
        />
      ) : null}
      {modals?.assignLeads
        ? createPortal(
            <AssignLeads
              handleClose={handleClose}
              accountId={customConfig?.CompanyId ?? getAccountId()}
              accountType={customConfig?.entityCode ?? getAccountTypeId()}
            />,
            document.body
          )
        : null}
      {modals?.setAsPrimaryContact ? (
        <SetPrimaryContact
          handleClose={handleClose}
          customConfig={fieldValues}
          onSuccess={updateGridDataAfterPause}
        />
      ) : null}
      {modals?.cancelSalesActivity
        ? createPortal(
            <Cancel
              onSuccess={updateGridDataAfterPause}
              setShowModal={handleClose}
              show={modals?.cancelSalesActivity}
              callerSource={CallerSource.SmartViews}
              entityId={entityId}
            />,
            document.body
          )
        : null}
      {modals.taskCancel
        ? createPortal(
            <TaskCancel
              taskIds={[fieldValues.id || '']}
              handleClose={handleClose}
              onSuccess={() => {
                updateGridDataAfterPause();
                onSuccess?.();
              }}
            />,
            document.body
          )
        : null}
      {modals.taskDelete
        ? createPortal(
            <TaskDelete
              taskIds={[fieldValues.id || '']}
              handleClose={handleClose}
              onSuccess={() => {
                updateGridDataAfterPause();
                onSuccess?.();
              }}
            />,
            document.body
          )
        : null}
      {modals.markTask
        ? createPortal(
            <MarkTask
              taskIds={[fieldValues.id || '']}
              taskActionType={
                action?.id === ACTION.MarkComplete ? TaskActionType.COMPLETE : TaskActionType.OPEN
              }
              handleClose={handleClose}
              onSuccess={() => {
                onSuccess?.();
                updateGridDataAfterPause(isSmartviews ? 2000 : 1000);
              }}
              task={fieldValues}
            />,
            document.body
          )
        : null}
      {modals.deleteRecurrence
        ? createPortal(
            <TaskDeleteRecurrence
              recurringTaskToDelete={fieldValues.UserTaskId || ''}
              handleClose={handleClose}
              onSuccess={updateGridDataAfterPause}
            />,
            document.body
          )
        : null}
      {modals.accountDelete
        ? createPortal(
            <AccountDelete
              handleClose={handleClose}
              repName={coreData?.entityRepNames?.[coreData?.entityDetailsType]}
              customConfig={customConfig}
              onSuccess={onSuccess}
            />,
            document.body
          )
        : null}
      {modals.hideList || modals.listUnhide || modals.listDelete
        ? createPortal(
            <ListAction
              handleClose={handleClose}
              entityIds={[entityId]}
              actionType={getActionType()}
              onSuccess={updateGridDataAfterPause}
              records={[fieldValues as IRecordType]}
            />,
            document.body
          )
        : null}
      {modals.listEdit || modals.listAddMore
        ? createPortal(
            <ListCreate
              show
              setShow={handleClose}
              selectedAction={{
                label: action?.label ?? '',
                value: action?.id ?? ''
              }}
              records={(fieldValues as IRecordType) || customConfig}
            />,
            document.body
          )
        : null}
    </>
  );
};

HandleAction.defaultProps = {
  entityIds: undefined,
  customConfig: {},
  onSuccess: undefined,
  entityRecords: undefined
};

export default HandleAction;
