interface IErrorConfig {
  title: string;
  description: string;
}

const ErrorMessages = {
  invalidEntityId: 'Lead with specified Id does not exist in the system',
  invalidGuid: 'Invalid Entity Id',
  permission: 'You do not have sufficient permissions. Please contact administrator.',
  invalidAccountEntity: 'The company type you sent was either not found or deleted. ',
  invalidOpportunityEntity: 'Activity does not exist.'
};

const getErrorConfig = (error: Error): IErrorConfig => {
  let title: string = '';
  let description: string = '';

  switch (error?.message) {
    case ErrorMessages.invalidEntityId:
    case ErrorMessages.invalidGuid:
      title = 'Invalid Lead ID';
      description = 'Lead with specified Id does not exist in the system';
      break;
    case ErrorMessages.permission:
      title = 'Access Denied';
      description =
        'You do not have sufficient permission to access this page, Please contact your Administrator.';
      break;
    case ErrorMessages.invalidAccountEntity:
      title = 'Invalid Account';
      description = 'The company type you sent was either not found or deleted.';
      break;
    case ErrorMessages.invalidOpportunityEntity:
      title = 'Invalid Opportunity';
      description = 'Opportunity with specified Id does not exist in the system';
      break;
    default:
      title = '';
      description = '';
  }
  return { title, description };
};

export { getErrorConfig, ErrorMessages };
