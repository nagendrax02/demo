import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedNotesDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    ...data,
    AdditionalDetails: additionalDetails,
    ActivityRenderType: ActivityRenderType.Note
  };
  return augmentedDetails;
};

export default getAugmentedNotesDetails;
