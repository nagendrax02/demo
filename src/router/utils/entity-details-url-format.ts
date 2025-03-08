import { isMiP } from 'common/utils/helpers';

export const getLeadDetailsPath = (leadId: string): string => {
  const activeTabQueryParam = new URLSearchParams(location.search)?.get('activeTab');
  let newUrl = '';
  if (!isMiP()) {
    newUrl = `/LeadDetails?LeadID=${leadId}`;
  } else {
    newUrl = `/LeadManagement/LeadDetails?LeadID=${leadId}`;
  }
  if (activeTabQueryParam) newUrl = `${newUrl}&activeTab=${activeTabQueryParam}`;
  return newUrl;
};

export const getOpportunityDetailsPath = (oppId: string, eventCode: string): string => {
  const activeTabQueryParam = new URLSearchParams(location.search)?.get('activeTab');
  let newUrl = '';
  if (!isMiP()) {
    newUrl = `/OpportunityDetails?opportunityId=${oppId}&opportunityEvent=${eventCode}`;
  } else {
    newUrl = `/OpportunityManagement/OpportunityDetails?opportunityId=${oppId}&opportunityEvent=${eventCode}`;
  }

  if (activeTabQueryParam) newUrl = `${newUrl}&activeTab=${activeTabQueryParam}`;
  return newUrl;
};

export const getAccountDetailsPath = (
  accountName: string,
  companyId: string,
  companyTypeId: string
): string => {
  if (!isMiP()) {
    return `/AccountDetails?accountId=${companyId}&accountType=${companyTypeId}`;
  }
  return `/AccountManagement/${accountName}/${companyId}`;
};
