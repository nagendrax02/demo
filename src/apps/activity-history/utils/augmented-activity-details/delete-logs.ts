import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../../types';
import { parseAdditionalDetails } from '../index';

const getAugmentedDeleteLogsDetails = (data: IActivityHistoryDetail): IAugmentedAHDetail => {
  const additionalDetails = parseAdditionalDetails(data.AdditionalDetails as string);
  const augmentedDetails = {
    Id: data.Id,
    ActivityEvent: data.ActivityEvent,
    ActivityType: data.ActivityType,
    ActivityName: data.ActivityName,
    ActivityDateTime: data.ActivityDateTime,
    ActivityRenderType: ActivityRenderType.DeleteLogs,
    AdditionalDetails: {
      CreatedByName: additionalDetails?.CreatedByName,
      CreatedBy: additionalDetails?.CreatedBy,
      ActivityScore: additionalDetails?.ActivityScore,
      RelatedActivityId: additionalDetails?.RelatedActivityId,
      ProspectActivityID: additionalDetails?.ProspectActivityID,
      RelatedActivityName: additionalDetails?.RelatedActivityName,
      RelatedActivityEvent: additionalDetails?.RelatedActivityEvent
    }
  };
  return augmentedDetails;
};

export default getAugmentedDeleteLogsDetails;
