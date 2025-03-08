import { trackError } from 'common/utils/experience/utils/track-error';
import { getSelectedFieldValue, IUpdate } from '../../bulk-update.store';
import { MXDuplicateEntryException, SCHEMA } from '../../constant';
import { API_ROUTES, EXCEPTION_MESSAGE, ExceptionType, FIELD_SEPARATOR } from 'common/constants';
import {
  showErrorNotification,
  handleFocus,
  verifyAdvSearchText,
  canProceedWithUpdateTo,
  handleResponse
} from './common';
import { AugmentedRenderType, BulkMode, IBulkUpdateField, InputId } from '../../bulk-update.types';
import { Module, httpPost } from 'common/utils/rest-client';
import {
  IField,
  ILeadBody,
  ILeadRetrieveCriteria,
  IResponse,
  IUpdateAllEntityRecordsBody,
  IUpdateAllEntityRecordsRetrieveCriteria
} from './bulk-update-save.types';
import handleWildCardRestriction from 'common/utils/wildcard-restriction';

const getLeadFieldValue = (selectedField: IBulkUpdateField, updatedTo: IUpdate): string => {
  if (selectedField?.augmentedRenderType === AugmentedRenderType.Checkbox) {
    return updatedTo?.value || '0';
  }

  return updatedTo?.value;
};

const getLeadField = (): IField[] => {
  const leadFields: IField[] = [];
  const { updatedTo, selectedField } = getSelectedFieldValue();
  const schemaName = selectedField?.schemaName?.split(FIELD_SEPARATOR)?.reverse().join('');

  if (schemaName === SCHEMA.DoNotTrack) {
    leadFields.push(
      {
        Key: schemaName,
        Value: updatedTo?.value
      },
      {
        Key: `mxcomments_${schemaName}`,
        Value: updatedTo.comment || ''
      }
    );
  } else if (schemaName === SCHEMA.RelatedCompanyId) {
    leadFields.push(
      {
        Key: schemaName,
        Value: updatedTo?.accountId as string
      },
      {
        Key: 'CompanyType',
        Value: updatedTo?.accountTypeId as string
      }
    );
  } else {
    leadFields.push({
      Key: schemaName,
      Value: getLeadFieldValue(selectedField, updatedTo)
    });
  }
  return leadFields;
};

const getPageSize = (): string => {
  const { initGridConfig, bulkSelectionMode } = getSelectedFieldValue();

  if (bulkSelectionMode?.mode === BulkMode.NLeads) {
    return bulkSelectionMode?.nLead as string;
  }

  return initGridConfig?.searchParams?.pageSize as string;
};

const getNLeads = (): string => {
  const { bulkSelectionMode } = getSelectedFieldValue();

  if (bulkSelectionMode?.mode === BulkMode.NLeads) {
    return bulkSelectionMode?.nLead as string;
  }

  return '0';
};

const canUpdateAllLeads = (): boolean => {
  const { bulkSelectionMode, bulkUpdateConfig } = getSelectedFieldValue();
  const { settings } = bulkUpdateConfig;

  if (bulkSelectionMode?.mode === BulkMode.TotalRecords) {
    return true;
  }
  if (bulkSelectionMode?.mode === BulkMode.NLeads) {
    if (Number(bulkSelectionMode?.nLead) > Number(settings?.MaxNLeadsToUpdateInSync)) {
      return true;
    }
    return false;
  }

  return false;
};

const getAdvancedSearchText = (updatedAdvSearch: string, oldAdvSearch: string): string => {
  const { bulkSelectionMode } = getSelectedFieldValue();

  if (bulkSelectionMode?.mode === BulkMode.SelectedLead) {
    return oldAdvSearch;
  }

  return updatedAdvSearch;
};

const canUpdateNLeads = (): boolean => {
  const { bulkSelectionMode, bulkUpdateConfig } = getSelectedFieldValue();
  const { settings } = bulkUpdateConfig;

  if (bulkSelectionMode.mode !== BulkMode.NLeads) {
    return true;
  }

  const maxLeads = Number(settings?.BulkLeadUpdateCount || 25000);
  const nLeads = Number(bulkSelectionMode.nLead);

  if (!nLeads || nLeads > maxLeads) {
    if (nLeads > maxLeads) {
      showErrorNotification(`You can update only upto 1 to ${maxLeads} in bulk update`);
    }
    handleFocus(InputId.NLeads);
    return false;
  }
  return true;
};

const canUpdateTotalRecords = (): boolean => {
  const { bulkSelectionMode, bulkUpdateConfig, initGridConfig } = getSelectedFieldValue();
  const { settings } = bulkUpdateConfig;
  if (bulkSelectionMode.mode !== BulkMode.TotalRecords) return true;
  if (!(settings?.EnableNLeadsFeature === '1' && initGridConfig?.gridConfig)) return true;

  if (initGridConfig?.gridConfig?.totalRecords > Number(settings?.BulkLeadUpdateCount)) {
    showErrorNotification(
      `You can update only upto 1 to ${settings?.BulkLeadUpdateCount} in bulk update`
    );

    return false;
  }
  return true;
};

const getLeadBody = (): ILeadBody => {
  const { initGridConfig } = getSelectedFieldValue();

  const updatedSearchParams = verifyAdvSearchText();

  const leadRetrieveCriteria: ILeadRetrieveCriteria = {
    LeadSearchParams: {
      SearchText: updatedSearchParams.searchText,
      AdvancedSearchText: getAdvancedSearchText(
        updatedSearchParams.advancedSearchText,
        initGridConfig?.searchParams?.advancedSearchText
      ),
      AdvancedSearchTextNew: getAdvancedSearchText(
        updatedSearchParams.advancedSearchTextNew,
        initGridConfig?.searchParams?.advancedSearchTextNew
      ),
      LeadOnlyConditions: updatedSearchParams?.customFilters,
      SortedOn: updatedSearchParams?.sortOn === '-None' ? '' : updatedSearchParams?.sortOn
    },
    PageSize: Number(getPageSize())
  };

  if (initGridConfig?.searchParams?.listId) {
    leadRetrieveCriteria.LeadSearchParams.ListId = initGridConfig?.searchParams?.listId;
  }

  return {
    LeadIds: initGridConfig?.entityIds,
    LeadFields: getLeadField(),
    LeadRetrieveCriteria: leadRetrieveCriteria,
    UpdateAll: canUpdateAllLeads(),
    Nleads: Number(getNLeads())
  };
};

const getUpdateAllLeadBody = (): IUpdateAllEntityRecordsBody => {
  const { initGridConfig } = getSelectedFieldValue();

  const leadRetrieveCriteria: IUpdateAllEntityRecordsRetrieveCriteria = {
    LeadSearchParams: {
      ListId: initGridConfig?.searchParams?.listId as string
    },
    PageSize: Number(getPageSize())
  };

  return {
    LeadIds: initGridConfig?.entityIds,
    LeadFields: getLeadField(),
    LeadRetrieveCriteria: leadRetrieveCriteria,
    UpdateAll: initGridConfig?.gridConfig?.updateAll ?? true
  };
};

const handleLeadSaveApiCall = async (
  onSuccess: (triggerRefresh?: boolean) => void
): Promise<void> => {
  const { initGridConfig } = getSelectedFieldValue();
  try {
    const leadBody = initGridConfig?.searchParams?.listId ? getUpdateAllLeadBody() : getLeadBody();

    if (leadBody?.LeadFields?.length <= 0) {
      return;
    }

    const response: IResponse = await httpPost({
      module: Module.Marvin,
      body: leadBody,
      path: API_ROUTES.leadBulkUpdate,
      callerSource: initGridConfig?.callerSource
    });
    handleResponse(response, leadBody?.LeadIds?.length, onSuccess);
  } catch (error) {
    trackError(error);
    if (error?.response?.ExceptionType === ExceptionType.MXWildcardAPIRateLimitExceededException) {
      handleWildCardRestriction({
        type: error?.response?.ExceptionType as string,
        message: error?.response?.ExceptionMessage as string
      });
    } else {
      showErrorNotification(
        error?.response?.ExceptionType === MXDuplicateEntryException
          ? `${initGridConfig?.entityIds?.length} Failed to update unique field`
          : error?.response?.ExceptionMessage || EXCEPTION_MESSAGE
      );
    }
  }
};

const canUpdateDropdown = (): boolean => {
  const { updatedTo, selectedField } = getSelectedFieldValue();

  const dropdowns = [
    AugmentedRenderType.SearchableDropDown,
    AugmentedRenderType.Dropdown,
    AugmentedRenderType.DropdownWithOthers
  ];
  if (dropdowns?.includes(selectedField?.augmentedRenderType)) {
    if (selectedField?.schemaName !== SCHEMA.TimeZone && !updatedTo?.value) {
      handleFocus(InputId.UpdateTo);
      return false;
    }
  }
  return true;
};

export const handleLeadBulkUpdate = async (
  onSuccess: (triggerRefresh?: boolean) => void
): Promise<void> => {
  if (
    !canProceedWithUpdateTo([AugmentedRenderType.RadioButtons, AugmentedRenderType?.ActiveUsers]) ||
    !canUpdateDropdown() ||
    !canUpdateTotalRecords() ||
    !canUpdateNLeads()
  ) {
    return;
  }

  await handleLeadSaveApiCall(onSuccess);
};
