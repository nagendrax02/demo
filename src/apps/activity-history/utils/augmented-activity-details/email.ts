import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedEmailDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    ...data,
    AdditionalDetails: additionalDetails,
    ActivityRenderType: ActivityRenderType.Email
  };
  return augmentedDetails;
};

export default getAugmentedEmailDetails;
