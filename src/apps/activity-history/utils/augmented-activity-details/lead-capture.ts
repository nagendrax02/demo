import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedLeadCaptureDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    ...data,
    AdditionalDetails: additionalDetails,
    ActivityRenderType: ActivityRenderType.LeadCapture
  };
  return augmentedDetails;
};

export default getAugmentedLeadCaptureDetails;
