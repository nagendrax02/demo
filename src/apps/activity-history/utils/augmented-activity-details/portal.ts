import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedPortalDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    Id: data.Id,
    ActivityEvent: data.ActivityEvent,
    ActivityType: data.ActivityType,
    ActivityDateTime: data.ActivityDateTime,
    ActivityRenderType: ActivityRenderType.Portal,
    AdditionalDetails: {
      CreatedByName: additionalDetails?.CreatedByName,
      CreatedBy: additionalDetails?.CreatedBy,
      PortalDisplayName: additionalDetails?.PortalDisplayName,
      PortalUrl: additionalDetails?.PortalUrl,
      ActivityScore: additionalDetails?.ActivityScore
    }
  };
  return augmentedDetails;
};

export default getAugmentedPortalDetails;
