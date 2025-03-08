import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */ // keeping all the action to be rendered in one file or else have separate them
import React, { useEffect, useState, lazy } from 'react';
import Delete from 'apps/entity-details/entity-action/delete';
import { getUserId } from 'apps/entity-details/utils';
import SendEmail from 'common/component-lib/send-email';
import CustomActions from 'common/component-lib/custom-actions';
import TaskCancel from 'common/component-lib/entity-actions/task-cancel';
import TaskDelete from 'common/component-lib/entity-actions/task-delete';
import Update from 'apps/entity-details/entity-action/update-action';
import { CallerSource } from 'common/utils/rest-client';
import { createPortal } from 'react-dom';
import { IBulkAction, IFetchCriteria, IRecordType } from '../../smartview-tab.types';
import { AssociatedEntity, FORM_ACTION } from './constants';
import { ACTION } from 'apps/entity-details/constants';
import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { Module, httpPost } from 'common/utils/rest-client';
import { IBulkLeadDeleteResponse } from '../../smartview-tab.types';
import { API_ROUTES, DEFAULT_ENTITY_REP_NAMES, EXCEPTION_MESSAGE } from 'common/constants';
import {
  useActiveTab,
  refreshGrid,
  useTabType,
  skipAutoRefresh,
  setSmartViewGridOverlay,
  getTabData
} from '../../smartview-tab.store';
import MergeLeads from '../../../external-components/merge-leads';
import { getSelectedRowIds, getDescription, getCoreData } from './utils';
import getEntityDataManager from 'common/utils/entity-data-manager';
import { EntityType } from 'common/types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import MarkTask from 'common/component-lib/entity-actions/mark-task';
import { TaskActionType } from 'common/component-lib/entity-actions/mark-task/mark-task.type';
import { STATUS_CODE } from 'apps/smart-views/augment-tab-data/task/constants';
import AddToList from 'apps/entity-details/entity-action/add-to-list';
import { IPaginationConfig } from '@lsq/nextgen-preact/grid/grid.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { getGridConfig } from './actionHelper';
import { getPersistedAuthConfig } from 'common/utils/authentication';
import { UserRole } from 'common/utils/authentication/constant';
import { ErrorMessages } from 'apps/entity-details/error-page/utils';
import { getOpportunityRepName } from 'apps/smart-views/utils/utils';
import { getStringifiedLeadType } from 'apps/smart-views/augment-tab-data/common-utilities/utils';
import { resetGrid } from '@lsq/nextgen-preact/v2/grid';
const BulkUpdateRenderer = withSuspense(lazy(() => import('./BulkUpdateRenderer')));
const BulkOpportunityDelete = withSuspense(lazy(() => import('./BulkOpportunityDelete')));
const BulkAccountDeleteRenderer = withSuspense(lazy(() => import('./BulkAccountDeleteRenderer')));
import ListAction from 'common/component-lib/entity-actions/list-action';
import { IDeleteActionHandler } from 'apps/entity-details/types/action-handler.types';
import { Variant } from '@lsq/nextgen-preact/button/button.types';
import { useFormRenderer } from 'apps/forms/form-renderer/new-form-renderer-store';

export interface IBulkActionHandler {
  entityId?: string;
  bulkAction: IBulkAction | null;
  setBulkAction: React.Dispatch<React.SetStateAction<IBulkAction | null>>;
  tabId: string;
  fetchCriteria: IFetchCriteria;
  pageConfig: IPaginationConfig;
  records: IRecordType[];
}

const BulkActionHandler = (props: IBulkActionHandler): JSX.Element => {
  const { bulkAction, setBulkAction, entityId, tabId, fetchCriteria, pageConfig, records } = props;
  const tabData = getTabData(tabId);

  const entityType = useTabType();
  const [tabLeadTypeConfig, setTabLeadTypeConfig] = useState<string>();
  const [leadRepresentationName, setLeadRepresentationName] = useState<IEntityRepresentationName>(
    DEFAULT_ENTITY_REP_NAMES.lead
  );

  const [oppRepresentationName, setOppRepresentationName] = useState<IEntityRepresentationName>(
    DEFAULT_ENTITY_REP_NAMES.opportunity
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const fetchLeadRepresentationName = (await getEntityDataManager(EntityType.Lead))
        ?.fetchRepresentationName;
      const [leadRepName, oppRepName, leadTypeConfig] = await Promise.all([
        fetchLeadRepresentationName?.(CallerSource.SmartViews, ''),
        getOpportunityRepName(),
        getStringifiedLeadType(tabId)
      ]);
      if (leadRepName) setLeadRepresentationName(leadRepName);
      setOppRepresentationName(oppRepName);
      if (leadTypeConfig) setTabLeadTypeConfig(leadTypeConfig);

      setIsLoading(false);
    })();
  }, []);

  const selectedRowIds = getSelectedRowIds(bulkAction?.selectedRows) as string[];

  const activeTabId = useActiveTab();
  const leadTypeConfigOfTab = tabData?.leadTypeConfiguration;

  const { showAlert } = useNotification();

  const [modals, setModals] = useState({
    customActions: false,
    delete: false,
    sendEmail: false,
    changeOwner: false,
    changeStage: false,
    bulkUpdate: false,
    addActivity: false,
    addOpportunity: false,
    mergeLeads: false,
    taskCancel: false,
    addToList: false,
    taskDelete: false,
    taskMarkOpen: false,
    taskMarkCompleted: false,
    changeTaskOwner: false,
    accountDelete: false,
    opportunityBulkDelete: false,
    changeStatusStage: false,
    bulkListHide: false,
    bulkListUnhide: false,
    bulkListDelete: false,
    bulkRemoveFromList: false
  });

  const handleModalToggle = (modalName: string, show: boolean): void => {
    skipAutoRefresh(show);
    setModals((prevModals) => ({ ...prevModals, [modalName]: show }));
  };

  const handleClose = (): void => {
    Object.keys(modals).forEach((modal) => {
      handleModalToggle(modal, false);
    });
    setBulkAction(null);
  };

  const onSuccess = (): void => {
    skipAutoRefresh(false);
    refreshGrid(activeTabId);
  };

  const handleDefaultForm = async (): Promise<void> => {
    const processActionClickHandler = await import(
      'apps/entity-details/components/vcard/actions/button-actions/button-action-handler'
    );
    const formConfig = await processActionClickHandler.getFormConfig({
      action: {
        id: FORM_ACTION[bulkAction?.action?.id as string],
        title: bulkAction?.action.label as string
      },
      entityId,
      onSuccess: onSuccess,
      onShowFormChange: (showForm) => {
        if (!showForm) {
          skipAutoRefresh(!showForm);
          useFormRenderer.getState().setFormConfig(null);
        }
      },
      customConfig: {
        IsBulkAction: 'true'
      },
      bulkConfig: {
        Ids: selectedRowIds,
        AdvancedSearchCondition: fetchCriteria.AdvancedSearch,
        CustomFilters:
          typeof fetchCriteria.CustomFilters === 'string' ? fetchCriteria.CustomFilters ?? '' : '',
        SearchText: fetchCriteria.SearchText ?? '',
        Type: 0,
        AssociatedEntity: AssociatedEntity[tabData.type] || AssociatedEntity[TabType.Lead],
        PageSize: pageConfig.pageSize,
        TotalCount: pageConfig.totalRecords || 0,
        TotalRecords: pageConfig.totalRecords || 0,
        IsSelectAll: selectedRowIds?.length === pageConfig.pageSize,
        TotalPages: Math.ceil((pageConfig?.totalRecords ?? 0) / +`${pageConfig?.pageSize ?? 1}`),
        AssociatedEntityTypeId: tabData?.entityCode
      }
    });
    if (modals.addActivity || modals.addOpportunity)
      useFormRenderer.getState().setFormConfig(formConfig);
  };

  const handleTaskOwnerChange = (): void => {
    const selectedRows = bulkAction ? Object.values(bulkAction.selectedRows) : [];

    const isUpdateNotAllowed = selectedRows.some(
      (row: { StatusCode: number }) =>
        row.StatusCode === STATUS_CODE.Complete || row.StatusCode === STATUS_CODE.Cancelled
    );

    if (isUpdateNotAllowed) {
      showAlert({
        type: Type.WARNING,
        message: 'You can change owner of task with status:- Pending and Overdue'
      });
      return;
    }

    handleModalToggle('changeTaskOwner', true);
  };

  const isCancelledTaskSelected = (taskActionType: TaskActionType): boolean => {
    const selectedRows = bulkAction ? Object.values(bulkAction.selectedRows) : [];
    const isTaskCancel = selectedRows.some(
      (row: { StatusCode: number }) => row.StatusCode === STATUS_CODE.Cancelled
    );
    const errorMsg = {
      [TaskActionType.COMPLETE]: 'You cannot mark a cancelled task as complete.',
      [TaskActionType.OPEN]: 'You cannot mark a cancelled task as open.'
    };
    if (isTaskCancel) {
      showAlert({ type: Type.ERROR, message: errorMsg[taskActionType] });
    }
    return isTaskCancel;
  };

  const handleAccountDeleteToggle = (): void => {
    if (
      getPersistedAuthConfig()?.User?.Role != UserRole.Admin &&
      Object.keys(bulkAction?.selectedRows || {})?.length > 1
    ) {
      showAlert({ type: Type.ERROR, message: ErrorMessages.permission });
      return;
    }
    handleModalToggle('accountDelete', true);
  };

  const handleBulkAction = {
    [ACTION.Delete]: (): void => {
      handleModalToggle('delete', true);
    },
    [ACTION.AccountDelete]: handleAccountDeleteToggle,
    [ACTION.ChangeStage]: (): void => {
      handleModalToggle('changeStage', true);
    },
    [ACTION.ChangeOwner]: (): void => {
      handleModalToggle('changeOwner', true);
    },
    [ACTION.Change_Status_Stage]: (): void => {
      handleModalToggle('changeStatusStage', true);
    },
    [ACTION.SendEmail]: (): void => {
      handleModalToggle('sendEmail', true);
    },
    [ACTION.BulkUpdate]: (): void => {
      if (bulkAction?.action?.canPerformAction?.({ bulkAction })) {
        showAlert({
          type: Type.ERROR,
          message: 'You do not have permissions'
        });
        return;
      }
      handleModalToggle('bulkUpdate', true);
    },
    [ACTION.AddActivity]: (): void => {
      handleModalToggle('addActivity', true);
      handleDefaultForm();
    },
    [ACTION.AddOpportunity]: (): void => {
      handleModalToggle('addOpportunity', true);
      handleDefaultForm();
    },
    [ACTION.MergeLeads]: (): void => {
      handleModalToggle('mergeLeads', true);
    },
    [ACTION.CustomActions]: (): void => {
      handleModalToggle('customActions', true);
    },
    [ACTION.TaskDelete]: (): void => {
      handleModalToggle('taskDelete', true);
    },
    [ACTION.TaskCancel]: (): void => {
      handleModalToggle('taskCancel', true);
    },
    [ACTION.MarkComplete]: (): void => {
      if (isCancelledTaskSelected(TaskActionType.COMPLETE)) return;
      handleModalToggle('taskMarkCompleted', true);
    },
    [ACTION.AddToList]: (): void => {
      handleModalToggle('addToList', true);
    },
    [ACTION.MarkOpen]: (): void => {
      if (isCancelledTaskSelected(TaskActionType.OPEN)) return;
      handleModalToggle('taskMarkOpen', true);
    },
    [ACTION.ChangeTaskOwner]: handleTaskOwnerChange,
    [ACTION.OpportunityBulkDelete]: (): void => {
      handleModalToggle('opportunityBulkDelete', true);
    },
    [ACTION.BulkListHide]: (): void => {
      handleModalToggle('bulkListHide', true);
    },
    [ACTION.BulkListUnhide]: (): void => {
      handleModalToggle('bulkListUnhide', true);
    },
    [ACTION.ListBulkDelete]: (): void => {
      handleModalToggle('bulkListDelete', true);
    },
    [ACTION.RemoveFromList]: (): void => {
      handleModalToggle('bulkRemoveFromList', true);
    }
  };

  useEffect(() => {
    if (!bulkAction) return;
    if (bulkAction?.action?.id) {
      handleBulkAction[bulkAction.action.id]?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkAction]);

  const leadRepName =
    selectedRowIds.length > 1
      ? leadRepresentationName?.PluralName
      : leadRepresentationName?.SingularName;

  const getActionType = (): string => {
    if (bulkAction?.action?.id === ACTION.ChangeTaskOwner) return ACTION.ChangeTaskOwner;
    if (bulkAction?.action?.id === ACTION.ChangeOwner) return ACTION.ChangeOwner;
    if (bulkAction?.action?.id === ACTION.Change_Status_Stage) return ACTION.Change_Status_Stage;
    if (bulkAction?.action?.id === ACTION.BulkListHide) return ACTION.BulkListHide;
    if (bulkAction?.action?.id === ACTION.BulkListUnhide) return ACTION.BulkListUnhide;
    if (bulkAction?.action?.id === ACTION.ListBulkDelete) return ACTION.ListBulkDelete;
    return ACTION.ChangeStage;
  };

  const getLeadNameLabel = (lead: Record<string, string | null>): string => {
    try {
      const { FirstName, EmailAddress, LastName } = lead;
      if (FirstName || LastName) {
        return `${FirstName || ''} ${LastName || ''}`;
      }
      if (EmailAddress) {
        return `${EmailAddress || ''}`;
      }
    } catch (error) {
      trackError(error);
    }
    return '';
  };

  const getAllLeads = (): IOption[] => {
    if (!bulkAction?.selectedRows) {
      return [];
    }
    return Object.values(bulkAction.selectedRows).map((lead: Record<string, string | null>) => {
      const { ProspectID } = lead;
      const label = getLeadNameLabel(lead);
      return { value: ProspectID, label };
    }) as IOption[];
  };

  const handleBulkLeadDelete = async (): Promise<void> => {
    try {
      const res: IBulkLeadDeleteResponse = await httpPost({
        path: API_ROUTES.bulkLeadDelete,
        module: Module.Marvin,
        body: {
          Ids: selectedRowIds
        },
        callerSource: CallerSource.SmartViews
      });

      if (
        res?.SuccessCount &&
        res.FailureCount === 0 &&
        (!res.RefrencedLeadIds || res.RefrencedLeadIds.length === 0)
      ) {
        showAlert({
          type: Type.SUCCESS,
          message: `${res.SuccessCount} ${leadRepresentationName.SingularName}(s) deleted successfully.`
        });
        onSuccess();
      } else {
        showAlert({
          type: Type.ERROR,
          message: res?.ErrorMessage || EXCEPTION_MESSAGE
        });
      }
    } catch (err) {
      showAlert({
        type: Type.ERROR,
        message: (err?.response?.ExceptionMessage || EXCEPTION_MESSAGE) as string
      });
    }
  };

  const deleteActionHandler = {
    variant: Variant.Error,
    getTitle: () => `Delete ${leadRepName}`,
    getDescription: async () =>
      getDescription(leadRepName, oppRepresentationName?.PluralName, selectedRowIds),
    handleDelete: handleBulkLeadDelete
  };

  return (
    <>
      {modals.bulkRemoveFromList
        ? createPortal(
            <Delete
              handleClose={handleClose}
              customConfig={bulkAction?.selectedRows as Record<string, string>}
              actionHandler={bulkAction?.action?.actionHandler as IDeleteActionHandler}
              onSuccess={onSuccess}
              repName={leadRepresentationName}
              isBulkAction
            />,
            document.body
          )
        : null}
      {modals.delete
        ? createPortal(
            <Delete handleClose={handleClose} actionHandler={deleteActionHandler} />,
            document.body
          )
        : null}
      {modals.accountDelete
        ? createPortal(
            <BulkAccountDeleteRenderer
              tabId={tabId}
              handleClose={handleClose}
              bulkAction={bulkAction}
            />,
            document.body
          )
        : null}
      {modals.sendEmail ? (
        <SendEmail
          show
          setShow={handleClose}
          toLead={getAllLeads()}
          fromUserId={getUserId()}
          leadRepresentationName={leadRepresentationName}
          callerSource={CallerSource.LeadDetailsVCard}
          handleSuccess={onSuccess}
          isLoading={isLoading}
          leadTypeInternalName={tabLeadTypeConfig}
        />
      ) : null}
      {modals?.bulkUpdate ? (
        <BulkUpdateRenderer
          bulkAction={bulkAction}
          handleClose={() => {
            handleClose();
            resetGrid(tabId);
          }}
          tabId={tabId}
          entityType={entityType}
        />
      ) : null}
      {modals.customActions && bulkAction?.action?.connectorConfig
        ? createPortal(
            <CustomActions
              entityRecords={Object.values(bulkAction?.selectedRows) as Record<string, unknown>[]}
              entityType={entityType}
              toggleShow={handleClose}
              connectorConfig={bulkAction.action.connectorConfig!}
              callerSource={CallerSource.SmartViews}
            />,
            document.body
          )
        : null}
      {modals.changeOwner ||
      modals.changeStage ||
      modals.changeTaskOwner ||
      modals.changeStatusStage
        ? createPortal(
            <Update
              entityId={selectedRowIds}
              handleClose={handleClose}
              actionType={getActionType()}
              required
              onSuccess={onSuccess}
              entityDetailsCoreData={getCoreData(entityType, tabData)}
              gridConfig={getGridConfig(tabId, Object.keys(bulkAction?.selectedRows || {})?.length)}
              searchParams={{
                advancedSearchText: fetchCriteria?.AdvancedSearch,
                searchText: fetchCriteria.SearchText
              }}
            />,
            document.body
          )
        : null}
      {modals.mergeLeads
        ? createPortal(
            <MergeLeads entityIds={selectedRowIds} onClose={handleClose} />,
            document.body
          )
        : null}
      {modals.taskCancel
        ? createPortal(
            <TaskCancel taskIds={selectedRowIds} handleClose={handleClose} onSuccess={onSuccess} />,
            document.body
          )
        : null}
      {modals.taskDelete
        ? createPortal(
            <TaskDelete taskIds={selectedRowIds} handleClose={handleClose} onSuccess={onSuccess} />,
            document.body
          )
        : null}
      {modals.taskMarkOpen
        ? createPortal(
            <MarkTask
              taskIds={selectedRowIds}
              taskActionType={TaskActionType.OPEN}
              setGridMask={setSmartViewGridOverlay}
              handleClose={handleClose}
              onSuccess={onSuccess}
            />,
            document.body
          )
        : null}
      {modals.addToList
        ? createPortal(
            <AddToList
              entityIds={selectedRowIds}
              handleClose={() => {
                handleClose();
                resetGrid(tabId);
              }}
              leadRepresentationName={leadRepresentationName}
              pageConfig={pageConfig}
              fetchCriteria={fetchCriteria}
              bulkAction={bulkAction}
              handleSuccess={() => {
                onSuccess();
                resetGrid(tabId);
              }}
              leadTypeInternalName={leadTypeConfigOfTab?.[0]?.LeadTypeInternalName}
            />,
            document.body
          )
        : null}
      {modals.taskMarkCompleted
        ? createPortal(
            <MarkTask
              taskIds={selectedRowIds}
              taskActionType={TaskActionType.COMPLETE}
              setGridMask={setSmartViewGridOverlay}
              handleClose={handleClose}
              onSuccess={onSuccess}
            />,
            document.body
          )
        : null}
      {modals.opportunityBulkDelete
        ? createPortal(
            <BulkOpportunityDelete
              tabId={tabId}
              handleClose={handleClose}
              bulkAction={bulkAction}
            />,
            document.body
          )
        : null}
      {modals.bulkListHide || modals.bulkListUnhide || modals.bulkListDelete
        ? createPortal(
            <ListAction
              entityIds={selectedRowIds}
              handleClose={handleClose}
              onSuccess={onSuccess}
              records={records}
              actionType={getActionType()}
              isBulkOperation
              leadRepresentationName={leadRepresentationName}
            />,
            document.body
          )
        : null}
    </>
  );
};

BulkActionHandler.defaultProps = {
  entityId: undefined
};

export default BulkActionHandler;
