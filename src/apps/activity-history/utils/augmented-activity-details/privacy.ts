import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedPrivacyDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    ...data,
    AdditionalDetails: additionalDetails,
    ActivityRenderType: ActivityRenderType.Privacy
  };
  return augmentedDetails;
};

export default getAugmentedPrivacyDetails;
