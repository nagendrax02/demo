import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { TabType } from 'apps/smart-views/constants/constants';

export const alertConfig = {
  FILTER_UPDATE_SUCCESSFUL: {
    type: Type.SUCCESS,
    message: 'Filters updated successfully'
  },
  COLUMN_UPDATED_SUCCESSFUL: {
    type: Type.SUCCESS,
    message: 'Columns updated successfully'
  },
  SELECT_AT_LEAST_ONE_CLM: {
    type: Type.ERROR,
    message: 'Select at least one column.'
  },
  SELECT_AT_LEAST_ONE_TASK_CLM: {
    type: Type.ERROR,
    message: 'Select at least one task column'
  },
  GENERIC: {
    type: Type.ERROR,
    message: ERROR_MSG.generic
  }
};

export const systemSelectedExportFields = {
  [TabType.Activity]: ['PACreatedOn', 'LeadIdentifier', 'ProspectActivityId'],
  [TabType.Opportunity]: ['LeadIdentifier', 'ProspectActivityId'],
  [TabType.Lead]: ['FirstName', 'LastName', 'EmailAddress'],
  [TabType.Task]: ['UserTaskAutoId'],
  [TabType.Account]: ['CompanyName', 'CompanyId']
};

export const redundantLeadExportSchemaNames = ['LeadIdentifier'];

export const leadRelatedCompanyNameReplacement = {
  relatedCompanyIdName: {
    value: 'P_RelatedCompanyIdName',
    newSchemaName: 'P_RelatedCompanyId'
  },
  companyTypeName: {
    value: 'P_CompanyTypeName',
    newSchemaName: 'P_CompanyType'
  }
};
export const redundantAccountField = ['Logo', 'CompanyName', 'AccountIdentifier'];

export const redundantAccountBaseTableType = {
  BASE_TABLE: 'Derived'
};

export const ADDRESS = '_Address';
export const COORDINATES = '_Coordinates';

export const redundantOpportunityFields = ['P_RelatedCompanyId', 'LeadIdentifier', 'P_OwnerIdName'];

export const EXPORT_WILDCARD_MESSAGE =
  'You cannot export -ENTITYNAME- with Wildcard operators within advanced search.';
