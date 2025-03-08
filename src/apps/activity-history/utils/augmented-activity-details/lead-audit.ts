import { EntityType } from 'src/common/types';
import {
  IActivityHistoryDetail,
  IAuditData,
  IAugmentedAHDetail,
  IAccountFields,
  ActivityRenderType
} from '../../types';
import { parseAdditionalDetails } from '../index';

const getAuditData = (
  type: EntityType,
  fields: IAccountFields[] | undefined,
  additionalDetails: Record<string, string> | null
): IAuditData => {
  const auditData: IAuditData = {
    CompanyName: undefined,
    PerformerName: undefined,
    OldValue: '',
    NewValue: '',
    ChangedBy: ''
  };
  if (type === EntityType.Account && fields) {
    fields.forEach((field) => {
      if (auditData && !auditData[field.SchemaName]) {
        auditData[field.SchemaName] = field.Value;
        if (field.SchemaName === 'PerformerName') {
          auditData.ChangedBy = field.Value;
        }
      }
    });
  }
  if ((type === EntityType.Lead || type === EntityType.Opportunity) && additionalDetails) {
    auditData.OldValue = additionalDetails.OldValue;
    auditData.NewValue = additionalDetails.NewValue;
    auditData.ChangedBy = additionalDetails.CreatedByName;
  }
  return auditData;
};

const getAugmentedLeadAuditDetails = (
  data: IActivityHistoryDetail,
  type: EntityType
): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const auditData = getAuditData(type, data.Fields, additionalDetails);
  const augmentedDetails = {
    ...data,
    ActivityRenderType: ActivityRenderType.LeadAudit,
    AdditionalDetails: additionalDetails,
    AuditData: auditData
  };
  return augmentedDetails;
};

export default getAugmentedLeadAuditDetails;
