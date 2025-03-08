import {
  customActivityParser,
  convertSecondsToMinute
} from 'common/utils/helpers/activity-history';
import { IAdditionalDetails } from 'apps/activity-history/types';

const getUserName = (firstName?: string, lastName?: string): string => {
  return `${firstName || ''} ${lastName || ''}`.trimEnd();
};

export const getActivityDetails = (
  additionalDetails: IAdditionalDetails
): Record<string, string> => {
  const {
    ActivityUserFirstName,
    ActivityUserLastName,
    CreatedBy = '',
    ActivityEvent_Note: ActivityEventNote
  } = additionalDetails || {};

  const parsedNote = customActivityParser(ActivityEventNote || '');
  const {
    Status = '',
    ResourceURL,
    Duration,
    Reciever = '',
    DisplayNumber = '',
    Caller = ''
  } = parsedNote || {};

  const duration = convertSecondsToMinute(Number(Duration));

  return {
    callStatus: Status,
    duration,
    caller: Caller,
    resourceUrl: ResourceURL,
    display: getUserName(ActivityUserFirstName, ActivityUserLastName) || Reciever,
    displayNumber: DisplayNumber,
    createdBy: CreatedBy
  };
};
