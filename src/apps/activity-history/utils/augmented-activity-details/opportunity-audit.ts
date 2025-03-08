import {
  ActivityRenderType,
  IActivityHistoryDetail,
  IAugmentedAHDetail,
  IAuditData
} from '../../types';
import { parseAdditionalDetails } from '../index';

const getAuditData = (additionalDetails: Record<string, string> | null): IAuditData => {
  let auditData: IAuditData = {
    OldValue: '',
    NewValue: '',
    ChangedBy: ''
  };
  if (additionalDetails) {
    auditData = {
      OldValue: additionalDetails.OldValue,
      NewValue: additionalDetails.NewValue,
      ChangedBy: additionalDetails.CreatedByName
    };
  }
  return auditData;
};

const getAugmentedOpportunityAuditDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const auditData = getAuditData(additionalDetails);
  const augmentedDetails = {
    ...data,
    ActivityRenderType: ActivityRenderType.OpportunityAudit,
    AdditionalDetails: additionalDetails,
    AuditData: auditData
  };
  return augmentedDetails;
};

export default getAugmentedOpportunityAuditDetails;
