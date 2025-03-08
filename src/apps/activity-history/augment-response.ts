import { IActivityHistoryDetail } from './types';
import { IAccountActivityHistory } from './types/activity-history.types';

const getAugmentedResponse = (
  response: IActivityHistoryDetail[] | IAccountActivityHistory | undefined
): IActivityHistoryDetail[] | undefined => {
  if ((response as IAccountActivityHistory)?.CompanyActivities) {
    return (response as IAccountActivityHistory).CompanyActivities;
  }
  return response as IActivityHistoryDetail[];
};

export { getAugmentedResponse };
