import { trackError } from 'common/utils/experience/utils/track-error';
import { safeParseJson } from 'common/utils/helpers';
import {
  getSelectedFieldValue,
  setError,
  setIsAsyncRequest,
  setPartialSuccessMessage
} from '../../bulk-update.store';
import { AugmentedRenderType, ISearchParams, InputId } from '../../bulk-update.types';
import { SEARCH_PARAMS_STRING } from '../../constant';
import { showNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { IResponse } from './bulk-update-save.types';

export const verifyAdvSearchText = (): ISearchParams => {
  const { initGridConfig } = getSelectedFieldValue();

  const updatedSearchParams = safeParseJson(
    JSON.stringify(initGridConfig?.searchParams)
  ) as ISearchParams;

  const { advancedSearchText, advancedSearchTextNew, customFilters } = updatedSearchParams;
  const filters = safeParseJson(customFilters || '{}') as { Conditions: string[] };
  if (!advancedSearchText && filters?.Conditions?.length) {
    updatedSearchParams.advancedSearchText = SEARCH_PARAMS_STRING;
  }
  if (!advancedSearchTextNew && filters?.Conditions?.length) {
    updatedSearchParams.advancedSearchTextNew = SEARCH_PARAMS_STRING;
  }
  return updatedSearchParams;
};

export const handleFocus = (id: InputId, message?: string): void => {
  try {
    setError(id, message);
    const inputElement = document.getElementById(id) as HTMLInputElement;
    inputElement?.focus();
  } catch (error) {
    trackError(error);
  }
};

export const showErrorNotification = (message: string): void => {
  showNotification({
    type: Type.ERROR,
    message: message
  });
};

export const showSuccessNotification = (message: string): void => {
  showNotification({
    type: Type.SUCCESS,
    message: message
  });
};
// eslint-disable-next-line complexity
export const canProceedWithUpdateTo = (
  noEmptyAllowedRenderType: AugmentedRenderType[]
): boolean => {
  const { updatedTo, selectedField } = getSelectedFieldValue();

  if (!selectedField) {
    handleFocus(InputId.SelectedField);
    return false;
  }

  if (selectedField?.isMandatory && !updatedTo?.value) {
    handleFocus(InputId.UpdateTo);
    return false;
  }

  const renderType = selectedField?.augmentedRenderType;
  if (renderType === AugmentedRenderType.DateTime) {
    if ((!updatedTo?.date && updatedTo?.time) || (updatedTo?.date && !updatedTo?.time)) {
      return false;
    }
  }

  //for fields like Email
  if (typeof updatedTo?.isValidInput === 'boolean') {
    if (!updatedTo?.isValidInput) {
      handleFocus(InputId.UpdateTo, 'invalid value');
      return false;
    }
  }

  if (noEmptyAllowedRenderType?.includes(renderType)) {
    if (!updatedTo?.value) {
      handleFocus(InputId.UpdateTo);
      return false;
    }
  }
  return true;
};

const createSuccessMessage = (count: number): string => {
  const { representationName } = getSelectedFieldValue();
  return `${count || 0} ${
    (count || 0) < 1 ? representationName?.SingularName : representationName?.PluralName
  } updated successfully`;
};
const getSuccessMessage = (response: IResponse, selectedEntityCount: number): string => {
  if ('SuccessCount' in response) {
    return createSuccessMessage(response?.SuccessCount || 0);
  }
  return createSuccessMessage(selectedEntityCount);
};

// eslint-disable-next-line complexity
const handleFallbackNotification = (
  response: IResponse,
  selectedEntityCount: number,
  onSuccess: (triggerRefresh?: boolean) => void
): void => {
  const { representationName } = getSelectedFieldValue();
  const { SuccessCount: successCount = 0, FailureCount: failureCount = 0 } = response;
  if (successCount > 0 && failureCount <= 0) {
    showSuccessNotification(getSuccessMessage(response, successCount));
    onSuccess(true);
    return;
  }

  if (successCount <= 0 && failureCount > 0) {
    showErrorNotification(
      `${failureCount} ${
        failureCount > 1 ? representationName?.PluralName : representationName?.SingularName
      } failed to update.`
    );
    return;
  }

  if (successCount > 0 && failureCount > 0) {
    setPartialSuccessMessage({
      failureCount: failureCount,
      successCount: successCount,
      showCount: true
    });

    return;
  }

  showErrorNotification(
    `${selectedEntityCount} ${
      selectedEntityCount > 1 ? representationName?.PluralName : representationName?.SingularName
    } failed to update.`
  );
};
export const handleResponse = (
  response: IResponse,
  selectedEntityCount: number,
  onSuccess: (triggerRefresh?: boolean) => void
): void => {
  const { representationName } = getSelectedFieldValue();

  if (response?.OperationStatus === 'Success') {
    if (response?.IsAsyncRequest) {
      setIsAsyncRequest(response.IsAsyncRequest);
      onSuccess(false);
      return;
    } else {
      showSuccessNotification(getSuccessMessage(response, selectedEntityCount));
      onSuccess(true);
    }
    return;
  }
  if (['Failure', 'Error']?.includes(response.OperationStatus) || response.Status === 'Error') {
    showErrorNotification(
      `${selectedEntityCount} ${
        selectedEntityCount > 1 ? representationName?.PluralName : representationName?.SingularName
      } failed to update.`
    );
    return;
  }
  handleFallbackNotification(response, selectedEntityCount, onSuccess);
};
