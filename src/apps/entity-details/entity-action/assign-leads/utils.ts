import { getHeader } from 'common/utils/helpers/helpers';
import { IAssignedLeadsCols } from './assign-leads.types';

const augmentRecord = (data: Record<string, string>[]): IAssignedLeadsCols[] => {
  const formattedResponse = data?.map((res: Record<string, string>) => {
    return {
      id: res.ProspectID,
      leadName: getHeader(res),
      emailAddress: res?.EmailAddress,
      stage: res?.ProspectStage,
      owner: res?.OwnerIdName
    };
  });

  return formattedResponse || [];
};

export { augmentRecord };
