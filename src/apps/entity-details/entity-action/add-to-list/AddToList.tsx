import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */

import {
  CREATE_NEW_LIST,
  ExceptionType,
  IAddToList,
  IResponse,
  IReturnResponse,
  OperationStatus
} from './add-to-list.types';
import { getSuccessMessage, invokeApi, isBulkActionValid } from './utils';
import { useState } from 'react';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { getEntityId } from 'common/utils/helpers';
import useEntityDetailStore from '../../entitydetail.store';
import AddToListModal from './AddToListModal';
import { IBulkSelectionMode } from 'common/component-lib/bulk-update/bulk-update.store';
import { BulkMode, InputId } from 'common/component-lib/bulk-update/bulk-update.types';
import { isSelectAll } from 'common/utils/helpers/helpers';

const AddToList = (props: IAddToList): JSX.Element => {
  const {
    handleClose,
    leadRepresentationName,
    entityIds,
    customConfig,
    pageConfig,
    bulkAction,
    fetchCriteria,
    handleSuccess,
    leadTypeInternalName
  } = props;

  const [showError, setShowError] = useState<{
    dropdown: boolean;
    listName: boolean;
    errorMsg: string;
  }>({
    dropdown: false,
    listName: false,
    errorMsg: ''
  });
  const [disabledSave, setDisabledSave] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [createNewListSelected, setCreateNewListSelected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [listName, setListName] = useState<string>('');
  const [bulkSelectionMode, setBulkSelectionMode] = useState<IBulkSelectionMode>({
    mode: BulkMode.SelectedLead
  });
  const [isAsyncRequest, setIsAsyncRequest] = useState(false);

  const [bulkNLeadError, setBulkNLeadError] = useState<InputId>();

  const config = {
    isSelectAll: isSelectAll(
      pageConfig?.totalRecords || 1,
      pageConfig?.pageSize || 1,
      Object.keys(bulkAction?.selectedRows || {})?.length || 1
    ),
    pageSize: pageConfig?.pageSize || 0,
    totalPages: Math.ceil((pageConfig?.totalRecords ?? 0) / (+`${pageConfig?.pageSize}` || 1)),
    totalRecords: pageConfig?.totalRecords || 0
  };

  const settingConfig = {
    BulkLeadUpdateCount: '25000',
    EnableNLeadsFeature: '1',
    MaxNLeadsToUpdateInSync: '200'
  };

  const leadType = useEntityDetailStore((state) => state?.augmentedEntityData?.properties?.fields)
    ?.LeadType;

  const { showAlert } = useNotification();
  const augmentedData = useEntityDetailStore(
    (state) => state.augmentedEntityData?.vcard?.body?.primarySection?.components
  )?.filter((data) => data.type === 1);

  const handleModeSelection = (value: IBulkSelectionMode): void => {
    setBulkSelectionMode(value);
  };

  const handleSelection = (options: IReturnResponse[]): void => {
    if (options?.length) {
      setSelectedOption([
        {
          label: options?.[0]?.label,
          value: options?.[0]?.value
        }
      ]);
      if (options[0]?.value !== CREATE_NEW_LIST.value) {
        setCreateNewListSelected(false);
      }
    } else {
      setSelectedOption([]);
    }
    setShowError((prev) => ({ ...prev, dropdown: false, listName: false }));
  };

  const handleSuccessNotification = (response: IResponse): void => {
    if (
      response?.Status === OperationStatus.SUCCESS ||
      response?.OperationStatus === OperationStatus.SUCCESS
    ) {
      showAlert({
        type: Type.SUCCESS,
        message: getSuccessMessage({
          leadRepresentationName,
          bulkSelectionMode,
          entityIds,
          config,
          augmentedData,
          selectedOption,
          listName,
          customConfig,
          bulkAction
        })
      });
      handleClose();
      handleSuccess?.();
    }
  };

  const validateSelectedOption = (): boolean => {
    if (!selectedOption.length) {
      setShowError((prev) => ({ ...prev, dropdown: true, errorMsg: 'Required Field' }));
      return true;
    }
    return false;
  };

  const validateListName = (): boolean => {
    if (createNewListSelected && !listName) {
      setShowError((prev) => ({
        ...prev,
        listName: true,
        errorMsg: 'List name cannot be blank'
      }));
      return true;
    }
    return false;
  };

  const handleApiError = (error): void => {
    trackError(error);
    showAlert({
      type: Type.ERROR,
      message: ERROR_MSG.generic
    });
    handleClose();
  };

  const handleApiResponse = (response: IResponse): void => {
    if (response?.ExceptionType === ExceptionType.MXXSSException && response?.ExceptionMessage) {
      showAlert({
        type: Type.ERROR,
        message: response.ExceptionMessage as string
      });
    } else if (
      response?.ExceptionType === ExceptionType.MXDuplicateEntryException ||
      response?.ExceptionType === ExceptionType.MXDuplicateEntityNameException
    ) {
      setShowError((prev) => ({
        ...prev,
        listName: true,
        errorMsg: 'List with the same name already exists in the system'
      }));
    } else if (response?.IsAsyncRequest) {
      setIsAsyncRequest(true);
    } else {
      handleSuccessNotification(response);
    }
  };

  const handleApiCall = async (): Promise<void> => {
    try {
      if (validateSelectedOption() || validateListName()) {
        return;
      }

      if (
        !isBulkActionValid({
          settingConfig: settingConfig,
          allRecordSelected: config?.isSelectAll,
          config: config,
          bulkSelectionMode: bulkSelectionMode,
          showAlert: showAlert,
          setBulkNLeadError
        })
      )
        return;

      setDisabledSave(true);
      const leadIds = entityIds ?? [getEntityId()];

      const response = await invokeApi({
        leadIds,
        selectedValue: selectedOption[0].value,
        listName,
        message,
        fetchCriteria,
        bulkSelectionMode,
        settingConfig,
        leadTypeInternalName: leadTypeInternalName ?? leadType ?? ''
      });

      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDisabledSave(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value);
  };

  const handleListNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setListName(event.target.value);
    setShowError((prev) => ({ ...prev, listName: false }));
  };

  return (
    <AddToListModal
      handleClose={handleClose}
      leadRepresentationName={leadRepresentationName}
      selectedOption={selectedOption}
      showError={showError}
      createNewListSelected={createNewListSelected}
      setCreateNewListSelected={setCreateNewListSelected}
      handleSelection={handleSelection}
      listName={listName}
      handleListNameChange={handleListNameChange}
      handleMessageChange={handleMessageChange}
      handleApiCall={handleApiCall}
      message={message}
      disabledSave={disabledSave}
      bulkAddToListConfig={{
        pageConfig: pageConfig,
        handleModeSelection: handleModeSelection,
        config: config,
        settingConfig: settingConfig,
        bulkSelectionMode: bulkSelectionMode,
        isAsyncRequest: isAsyncRequest,
        bulkNLeadError: bulkNLeadError
      }}
      leadTypeInternalName={leadTypeInternalName ?? leadType ?? ''}
    />
  );
};

export default AddToList;
