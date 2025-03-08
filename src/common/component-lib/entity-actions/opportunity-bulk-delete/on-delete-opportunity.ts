import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IGridConfig, IResponse, ISearchParams } from './delete.type';
import { CallerSource, httpPost, Module } from 'src/common/utils/rest-client';
import { API_ROUTES, EXCEPTION_MESSAGE, ExceptionType } from 'common/constants';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { getRepName } from './utils';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';

export const showSuccessNotification = (
  entityIds: string[],
  repName: IEntityRepresentationName,
  onSuccess: () => void
): void => {
  showNotification({
    type: Type.SUCCESS,
    message: `${entityIds?.length > 1 ? entityIds?.length : ''} ${getRepName(
      repName,
      entityIds?.length
    )} Deleted Successfully`?.trim()
  });
  onSuccess();
};

export const showErrorNotification = (
  entityIds: string[],
  repName: IEntityRepresentationName
): void => {
  showNotification({
    type: Type.ERROR,
    message: `${entityIds?.length > 1 ? entityIds?.length : ''} ${getRepName(
      repName,
      entityIds?.length
    )} deletion failed.`?.trim()
  });
};

// eslint-disable-next-line complexity
const handleResponseNotification = ({
  entityIds,
  repName,
  response,
  setPartialMessage,
  onSuccess
}: {
  entityIds: string[];
  repName: IEntityRepresentationName;
  response: IResponse;
  setPartialMessage: (data: { successCount: number; failureCount: number }) => void;
  onSuccess: () => void;
}): void => {
  const { FailureCount, IsSuccess, SuccessCount } = response;

  if (entityIds?.length === 1) {
    if (IsSuccess) {
      showSuccessNotification(entityIds, repName, onSuccess);
    } else {
      showErrorNotification(entityIds, repName);
    }
    return;
  }

  if (SuccessCount > 0 && FailureCount <= 0) {
    showSuccessNotification(entityIds, repName, onSuccess);
    return;
  }

  if (SuccessCount <= 0 && FailureCount > 0) {
    showErrorNotification(entityIds, repName);
    return;
  }

  if (SuccessCount > 0 && FailureCount > 0) {
    setPartialMessage({
      failureCount: FailureCount,
      successCount: SuccessCount
    });
    return;
  }

  showErrorNotification(entityIds, repName);
};

const handleAsyncBulkDelete = async (
  eventCode: string,
  searchParams?: ISearchParams
): Promise<IResponse> => {
  const response: IResponse = await httpPost({
    path: API_ROUTES.opportunityBulkDeleteAsync,
    module: Module.Marvin,
    body: {
      ActivityEventCode: eventCode,
      IsOpportunity: true,
      ActivityFields: '',
      SearchText: searchParams?.searchText,
      LSQInvocationSourceDetails: {
        Name: 'BulkDelete'
      },
      ActivitySearchCondition: searchParams?.activitySearchCondition
    },
    callerSource: CallerSource.OpportunityDelete
  });
  return response;
};

const handleSingleDelete = async (entityId: string): Promise<IResponse> => {
  const response: IResponse = await httpPost({
    path: `${API_ROUTES.activityDelete}${entityId}`,
    module: Module.Marvin,
    body: { id: entityId },
    callerSource: CallerSource.OpportunityDelete
  });
  return response;
};

const handleBulkDelete = async (entityId: string[]): Promise<IResponse> => {
  const response: IResponse = await httpPost({
    path: API_ROUTES.opportunityBulkDelete,
    module: Module.Marvin,
    body: { Ids: entityId },
    callerSource: CallerSource.OpportunityDelete
  });
  return response;
};

const handleDelete = async (config: {
  entityIds: string[];
  eventCode: string;
  deleteAll: boolean;
  searchParams?: ISearchParams;
  gridConfig?: IGridConfig;
}): Promise<IResponse> => {
  const { gridConfig, searchParams, eventCode, entityIds, deleteAll } = config;

  let response: IResponse = {
    IsSuccess: false,
    FailureCount: 0,
    IsAsyncRequest: false,
    SuccessCount: 0
  };

  if (gridConfig?.isSelectAll && deleteAll) {
    response = await handleAsyncBulkDelete(eventCode, searchParams);
  } else if (entityIds?.length === 1) {
    response = await handleSingleDelete(entityIds[0]);
  } else {
    response = await handleBulkDelete(entityIds);
  }

  return response;
};

// eslint-disable-next-line max-lines-per-function
export const onOpportunityDelete = async ({
  entityIds,
  eventCode,
  onSuccess,
  repName,
  setIsDeleting,
  gridConfig,
  searchParams,
  setIsAsyncReq,
  setPartialMessage,
  deleteAll
}: {
  onSuccess: () => void;
  setIsDeleting: (data: boolean) => void;
  setIsAsyncReq: (data: boolean) => void;
  setPartialMessage: (data: { successCount: number; failureCount: number }) => void;
  repName: IEntityRepresentationName;
  entityIds: string[];
  eventCode: string;
  deleteAll: boolean;
  searchParams?: ISearchParams;
  gridConfig?: IGridConfig;
}): Promise<void> => {
  setIsDeleting(true);
  try {
    const response = await handleDelete({
      entityIds,
      eventCode,
      gridConfig,
      searchParams,
      deleteAll
    });

    if (response.IsAsyncRequest) {
      setIsAsyncReq(true);
    } else {
      handleResponseNotification({ entityIds, repName, response, setPartialMessage, onSuccess });
    }
  } catch (error) {
    if (error?.response?.ExceptionType === ExceptionType.MXWildcardAPIRateLimitExceededException) {
      handleWildCardRestriction({
        type: error?.response?.ExceptionType as string,
        message: error?.response?.ExceptionMessage as string
      });
    } else {
      showNotification({
        type: Type.ERROR,
        message: `${error?.response?.ExceptionMessage || EXCEPTION_MESSAGE}`
      });
    }
    trackError(error);
  }
  setIsDeleting(false);
};
