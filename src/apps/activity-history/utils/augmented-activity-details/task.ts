import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedTaskDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    ...data,
    AdditionalDetails: additionalDetails,
    ActivityRenderType: ActivityRenderType.Task
  };
  return augmentedDetails;
};

export default getAugmentedTaskDetails;
