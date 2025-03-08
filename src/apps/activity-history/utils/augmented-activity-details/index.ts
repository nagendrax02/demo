import { ActivityRenderType, IAugmentedActivityDetails } from '../../types';
import getAugmentedCustomDetails from './custom';
import getAugmentedDeleteLogsDetails from './delete-logs';
import getAugmentedDynamicFormDetails from './dynamic-form';
import getAugmentedEmailDetails from './email';
import getAugmentedLeadAuditDetails from './lead-audit';
import getAugmentedLeadCaptureDetails from './lead-capture';
import getAugmentedNotesDetails from './notes';
import getAugmentedOpportunityAuditDetails from './opportunity-audit';
import getAugmentedOpportunityDetails from './opportunity';
import getAugmentedPhoneDetails from './phone';
import getAugmentedPortalDetails from './portal';
import getAugmentedPrivacyDetails from './privacy';
import getAugmentedTaskDetails from './task';
import getAugmentedWebDetails from './web';

const augmentedActivityDetails = (): IAugmentedActivityDetails => {
  return {
    [ActivityRenderType.Custom]: getAugmentedCustomDetails,
    [ActivityRenderType.DeleteLogs]: getAugmentedDeleteLogsDetails,
    [ActivityRenderType.DynamicForm]: getAugmentedDynamicFormDetails,
    [ActivityRenderType.Email]: getAugmentedEmailDetails,
    [ActivityRenderType.LeadAudit]: getAugmentedLeadAuditDetails,
    [ActivityRenderType.LeadCapture]: getAugmentedLeadCaptureDetails,
    [ActivityRenderType.Note]: getAugmentedNotesDetails,
    [ActivityRenderType.OpportunityAudit]: getAugmentedOpportunityAuditDetails,
    [ActivityRenderType.Opportunity]: getAugmentedOpportunityDetails,
    [ActivityRenderType.Phone]: getAugmentedPhoneDetails,
    [ActivityRenderType.Portal]: getAugmentedPortalDetails,
    [ActivityRenderType.Privacy]: getAugmentedPrivacyDetails,
    [ActivityRenderType.Task]: getAugmentedTaskDetails,
    [ActivityRenderType.Web]: getAugmentedWebDetails,
    [ActivityRenderType.Default]: getAugmentedCustomDetails
  };
};

export default augmentedActivityDetails;
