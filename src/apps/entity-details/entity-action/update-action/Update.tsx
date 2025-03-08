import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react';
import { ACTION } from '../../constants';
import {
  getChangeStatusStageConfig,
  getConfig,
  getRepName,
  handleApiResponse,
  validateChangeStatusStageAction
} from './utils';
import { CallerSource } from 'common/utils/rest-client';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IUpdate, OperationStatus } from './update.types';
import { IAugmentedEntity } from '../../types';
import RenderUpdate from './RenderUpdate';
import ChangeStage from '../change-stage';
import ChangeOwner from '../change-owner';
import { ConfigType, IConfig } from '../change-stage/change-stage.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';
import useEntityDetailStore from '../../entitydetail.store';
import { getApiHandler } from './api-handler/api-handler';
import ChangeStatusStage from '../change-status-stage';
import { IResponse } from './update.types';
import { leadApiHandler } from './api-handler/lead';
import { taskApiHandler } from './api-handler/task';
import { ExceptionType, IError } from 'common/component-lib/entity-export/entity-export.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';

const Update = (props: IUpdate): JSX.Element => {
  const {
    entityId,
    required,
    onSuccess,
    actionType,
    handleClose,
    customConfig,
    entityDetailsCoreData,
    gridConfig,
    searchParams
  } = props;

  const { entityRepNames, entityDetailsType, eventCode, entityIds } = entityDetailsCoreData;
  const primaryEntityRepName =
    entityDetailsType === EntityType.Task
      ? entityRepNames?.[EntityType.Lead]
      : entityRepNames?.[entityDetailsType];

  const [isLoading, setIsLoading] = useState(false);
  const [disabledSave, setDisabledSave] = useState<boolean>(
    false || actionType === ACTION.ChangeStage
  );
  const [message, setMessage] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [secondarySelectedOption, setSecondarySelectedOption] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [showError, setShowError] = useState<boolean>(false);
  const [showSecondaryError, setShowSecondaryError] = useState<boolean>(false);
  const [showMessageError, setShowMessageError] = useState<boolean>(false);
  const [updatedAllPageRecord, setUpdateAllPageRecord] = useState(false);
  const [isAsyncReq, setAsyncReq] = useState(false);

  const [config, setConfig] = useState<IConfig>();

  const [commentsOptions, setCommentsOptions] = useState<IOption[]>([]);

  const [sendCalenderInvite, setSendCalenderInvite] = useState<boolean>(false);

  const entityTypeFromStore = useEntityDetailStore((state) => state.entityType);

  const entityType = entityDetailsType || entityTypeFromStore;

  const { showAlert } = useNotification();

  const setAugmentedEntityData = useEntityDetailStore((state) => state.setAugmentedEntityData);

  const augmentedEntityProperty = useEntityDetailStore(
    (state) => state.augmentedEntityData
  ) as IAugmentedEntity;

  const stageValue =
    customConfig?.ProspectStage ||
    augmentedEntityProperty?.properties?.entityProperty?.find((d) => {
      return d.schemaName === 'ProspectStage';
    })?.value ||
    '';

  useEffect(() => {
    if (actionType === ACTION.ChangeStage || actionType === ACTION.Change_Status_Stage) {
      (async function getStageConfig(): Promise<void> {
        if (entityType === EntityType.Lead || entityType === EntityType.Task) {
          await getConfig({
            setConfig: setConfig,
            setCommentsOptions: setCommentsOptions,
            callerSource: CallerSource.LeadDetailsVCard
          });
        } else if (entityType === EntityType.Opportunity) {
          await getChangeStatusStageConfig({
            setConfig: setConfig,
            callerSource: CallerSource.OpportunityDetailsVCard,
            eventCode
          });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBodyTitle = {
    [ACTION.ChangeOwner]: `Update ${primaryEntityRepName?.SingularName} Field with new value for the selected ${getRepName(
      primaryEntityRepName,
      entityId?.length
    )}`,
    [ACTION.ChangeStage]: `Update ${primaryEntityRepName?.SingularName} Field with new value for the selected ${getRepName(
      primaryEntityRepName,
      entityId?.length
    )}`,
    [ACTION.Change_Status_Stage]: `Update ${primaryEntityRepName?.SingularName} Field with new value for the selected ${getRepName(
      primaryEntityRepName,
      entityId?.length
    )}`,
    [ACTION.ChangeTaskOwner]: 'Update owner of selected tasks'
  };

  const compRender = {
    [ACTION.ChangeStage]: (
      <ChangeStage
        entityType={entityType}
        setDisabledSave={setDisabledSave}
        stageValue={stageValue}
        setMessage={setMessage}
        message={message}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        setShowError={setShowError}
        config={config}
        setCommentsOptions={setCommentsOptions}
        commentsOptions={commentsOptions}
        showError={showError}
        entityDetailsCoreData={entityDetailsCoreData}
      />
    ),
    [ACTION.ChangeOwner]: (
      <ChangeOwner
        setShowError={setShowError}
        setSelectedOption={setSelectedOption}
        showError={showError}
        selectedOption={selectedOption}
      />
    ),
    [ACTION.ChangeTaskOwner]: (
      <ChangeOwner
        setShowError={setShowError}
        setSelectedOption={setSelectedOption}
        showError={showError}
        selectedOption={selectedOption}
      />
    ),
    [ACTION.Change_Status_Stage]: (
      <ChangeStatusStage
        eventCode={entityDetailsCoreData?.eventCode || -1}
        bodyTitle={getBodyTitle?.[actionType]}
        setStage={setSelectedOption}
        stage={selectedOption}
        stageError={showError}
        setStageError={setShowError}
        setStatus={setSecondarySelectedOption}
        status={secondarySelectedOption}
        statusError={showSecondaryError}
        setStatusError={setShowSecondaryError}
        config={config}
        setMessage={setMessage}
        message={message}
        messageError={showMessageError}
        setMessageError={setShowMessageError}
        entityDetailsType={entityDetailsCoreData.entityDetailsType}
        gridConfig={gridConfig}
        setUpdateAllPageRecord={setUpdateAllPageRecord}
        updateAllPageRecord={updatedAllPageRecord}
        primaryEntityRepName={primaryEntityRepName}
      />
    )
  };

  const handleSuccessNotification = (): void => {
    const successNotification = {
      [ACTION.ChangeStage]: (): void => {
        showAlert({
          type: Type.SUCCESS,
          message: `${primaryEntityRepName?.SingularName} Stage updated successfully`
        });
      },
      [ACTION.ChangeOwner]: (): void => {
        showAlert({
          type: Type.SUCCESS,
          message: `${primaryEntityRepName?.SingularName} Owner updated successfully`
        });
      },
      [ACTION.Change_Status_Stage]: (): void => {
        showAlert({
          type: Type.SUCCESS,
          message: `Status updated successfully`
        });
      }
    };
    successNotification[actionType]();
  };

  const handleErrorNotification = (response: OperationStatus): void => {
    if (response === OperationStatus.FAILURE) {
      showAlert({
        type: Type.ERROR,
        message:
          entityDetailsType === EntityType.Opportunity
            ? `${entityId?.length} ${getRepName(
                primaryEntityRepName,
                entityId?.length
              )} failed to update.`
            : ERROR_MSG.failedToUpdate
      });
    } else {
      showAlert({
        type: Type.ERROR,
        message: `${entityId?.length} ${getRepName(
          primaryEntityRepName,
          entityId?.length
        )} failed to update.`
      });
    }
  };

  const handleApiRequest = (): Promise<IResponse> => {
    const data = {
      entityId,
      config,
      commentsOptions,
      message,
      actionType,
      selectedOption,
      secondarySelectedOption,
      eventCode,
      entityIds,
      searchParams,
      updatedAllPageRecord
    };
    if (
      entityDetailsType === EntityType.Task &&
      (actionType === ACTION.ChangeStage || actionType === ACTION.ChangeOwner)
    ) {
      return leadApiHandler(data);
    }
    return getApiHandler?.[entityDetailsType](data);
  };

  const handleTaskOwnerChangeApiCall = async (): Promise<void> => {
    const response = await taskApiHandler({ entityId, selectedOption, sendCalenderInvite });
    if (response?.length) {
      showAlert({
        type: Type.SUCCESS,
        message: `${response.length} Tasks Owner updated successfully`
      });
      if (onSuccess) onSuccess();
    } else {
      showAlert({
        type: Type.ERROR,
        message: ERROR_MSG.generic
      });
    }
  };

  const handleApiCall = async (): Promise<void> => {
    if (
      (actionType === ACTION.ChangeOwner || actionType === ACTION.ChangeTaskOwner) &&
      !selectedOption.length
    ) {
      setShowError(true);
      return;
    }

    if (
      actionType === ACTION.ChangeStage &&
      config?.IsMandatory &&
      !message &&
      config?.Type?.toUpperCase() === ConfigType.TextArea
    ) {
      setShowError(true);
      return;
    }

    if (actionType === ACTION.Change_Status_Stage) {
      const validatedAction = validateChangeStatusStageAction({
        stageValue: selectedOption,
        statusValue: secondarySelectedOption,
        setStageError: setShowError,
        setStatusError: setShowSecondaryError,
        message,
        setMessageError: setShowMessageError,
        config
      });
      if (!validatedAction) return;
    }

    setIsLoading(true);
    setDisabledSave(true);
    setShowError(false);
    let isAsyncRequest = false;
    try {
      if (entityDetailsType === EntityType.Task && actionType === ACTION.ChangeTaskOwner) {
        await handleTaskOwnerChangeApiCall();
      } else {
        const response = await handleApiRequest();
        isAsyncRequest = response?.IsAsyncRequest || false;
        if (!isAsyncRequest) {
          handleApiResponse({
            response,
            handleSuccessNotification,
            augmentedEntityProperty,
            selectedOption,
            setAugmentedEntityData,
            actionType,
            handleErrorNotification,
            onSuccess
          });
        } else {
          setAsyncReq(isAsyncRequest);
        }
      }
    } catch (error) {
      trackError(error);
      if (
        (error as IError)?.response?.ExceptionType === ExceptionType?.MXUnAuthorizedAccessException
      ) {
        showAlert({
          type: Type.ERROR,
          message: ERROR_MSG.failedToUpdate || ERROR_MSG.actonPermission
        });
      }
    } finally {
      setIsLoading(false);
      setDisabledSave(false);
      if (!isAsyncRequest) {
        handleClose();
      }
    }
  };

  return (
    <RenderUpdate
      leadRepresentationName={primaryEntityRepName}
      actionType={actionType}
      compRender={compRender}
      getBodyTitle={getBodyTitle}
      required={required}
      handleClose={handleClose}
      handleApiCall={handleApiCall}
      isLoading={isLoading}
      disabledSave={disabledSave}
      selectedEntityCount={entityId?.length}
      showError={showError}
      directRenderComponent={actionType === ACTION.Change_Status_Stage}
      entityDetailsCoreData={entityDetailsCoreData}
      sendCalenderInvite={sendCalenderInvite}
      setSendCalenderInvite={setSendCalenderInvite}
      isAsyncReq={isAsyncReq}
    />
  );
};

Update.defaultProps = {
  required: false
};

export default Update;
