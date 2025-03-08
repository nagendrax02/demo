import { trackError } from 'common/utils/experience/utils/track-error';
import {
  canProceedWithUpdateTo,
  handleFocus,
  handleResponse,
  showErrorNotification
} from './common';
import { getSelectedFieldValue } from '../../bulk-update.store';
import { AugmentedRenderType, BulkMode, InputId } from '../../bulk-update.types';
import { SCHEMA } from '../../constant';
import { IActivityBody, IColumnField, IResponse } from './bulk-update-save.types';
import { API_ROUTES, EXCEPTION_MESSAGE, ExceptionType, FIELD_SEPARATOR } from 'common/constants';
import { Module, httpPost } from 'common/utils/rest-client';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';

const canUpdateDropdown = (): boolean => {
  const { updatedTo, selectedField } = getSelectedFieldValue();

  const dropdowns = [
    AugmentedRenderType.SearchableDropDown,
    AugmentedRenderType.Dropdown,
    AugmentedRenderType.DropdownWithOthers
  ];
  if (dropdowns?.includes(selectedField?.augmentedRenderType)) {
    if (
      selectedField?.schemaName !== SCHEMA.TimeZone &&
      !selectedField?.isCFS &&
      !updatedTo?.value
    ) {
      handleFocus(InputId.UpdateTo);
      return false;
    }
  }
  return true;
};

export const getActivityFields = (): IColumnField[] => {
  const activityFields: IColumnField[] = [];
  const { updatedTo, selectedField } = getSelectedFieldValue();
  const schemaName = selectedField?.schemaName?.split(FIELD_SEPARATOR)?.reverse()?.join('~');

  activityFields.push({
    ColumnName: schemaName,
    ColumnValue: updatedTo?.value
  });

  return activityFields;
};

const getActivityBody = (): IActivityBody | null => {
  const { initGridConfig } = getSelectedFieldValue();
  const { bulkSelectionMode } = getSelectedFieldValue();
  if (!Number(initGridConfig.eventCode)) return null;
  return {
    ActivityIds: initGridConfig.entityIds,
    ActivityFields: getActivityFields(),
    UpdateAll: bulkSelectionMode.mode === BulkMode.UpdateAll,
    ActivityEventCode: Number(initGridConfig.eventCode),
    IsOpportunity: false,
    ActivitySearchParams: initGridConfig?.searchParams.advancedSearchText,
    SearchText: initGridConfig?.searchParams?.searchText,
    IsStatusUpdate: false
  };
};
export const handleActivitySave = async (
  onSuccess: (triggerRefresh?: boolean) => void
): Promise<void> => {
  const { initGridConfig } = getSelectedFieldValue();
  try {
    const body = getActivityBody();

    if (!body || !body?.ActivityFields?.length) return;
    const response: IResponse = await httpPost({
      module: Module.Marvin,
      body,
      path: API_ROUTES.activityBulkUpdate,
      callerSource: initGridConfig?.callerSource
    });
    handleResponse(response, body?.ActivityIds?.length, onSuccess);
  } catch (error) {
    trackError(error);
    if (error?.response?.ExceptionType === ExceptionType.MXWildcardAPIRateLimitExceededException) {
      handleWildCardRestriction({
        type: error?.response?.ExceptionType as string,
        message: error?.response?.ExceptionMessage as string
      });
    } else {
      showErrorNotification(error?.response?.ExceptionMessage || EXCEPTION_MESSAGE);
    }
  }
};

export const handleActivityBulkUpdate = async (
  onSuccess: (triggerRefresh?: boolean) => void
): Promise<void> => {
  if (
    !canProceedWithUpdateTo([
      AugmentedRenderType.Product,
      AugmentedRenderType.ActiveUsers,
      AugmentedRenderType.LargeOptionSet
    ]) ||
    !canUpdateDropdown()
  ) {
    return;
  }

  await handleActivitySave(onSuccess);
};
