import { ACTIVITY, OPPORTUNITY } from 'apps/activity-history/constants';
import { IAdditionalDetails, IAugmentedAHDetail } from 'apps/activity-history/types';
import {
  ADDED_BY,
  CANCELLED_BY,
  DELETED_BY,
  MODIFIED_BY,
  CATEGORY,
  MESSAGE,
  NOTES_MESSAGE,
  NOTES_MESSAGE_REPLACED,
  TOPBAR,
  WEBWIDGETNAME,
  CANCELLED_ACTIVITY
} from '../constants';
import { safeParseJson } from 'common/utils/helpers';

export const isConnectorEmailSection = (eventNote: string): boolean => {
  return eventNote
    ? !eventNote.startsWith('{keyvalueinfo}{Revenue') && eventNote.indexOf('{keyvalueinfo}') === 0
    : false;
};

export const isTrackLocation = (additionalDetails: IAdditionalDetails): boolean => {
  if (additionalDetails) {
    const trackLocation = additionalDetails?.TrackLocation;
    const latitude = additionalDetails?.Latitude;
    const longitude = additionalDetails?.Longitude;
    return !!(trackLocation === '1' && !!longitude && latitude);
  }
  return false;
};

const isChangeLogEvent = (activityEvent: number): boolean => {
  return activityEvent === ACTIVITY.CHANGE_LOG || activityEvent === ACTIVITY.OPPORTUNITY_CHANGE_LOG;
};

const isDeleteLogEvent = (activityEvent: number): boolean => {
  return (
    activityEvent === ACTIVITY.ON_OPPORTUNITY_DELETE_LOG ||
    activityEvent === ACTIVITY.OPPORTUNITY_DELETE_LOG ||
    activityEvent === ACTIVITY.DELETE_LOG
  );
};

const handleSaleCancelled = (): string => {
  return CANCELLED_BY;
};

export const getByLabel = (activityEvent: number, isSaleCancelled?: boolean): string => {
  if (activityEvent === ACTIVITY.SALES && isSaleCancelled) {
    return handleSaleCancelled();
  }
  if (isChangeLogEvent(activityEvent)) {
    return MODIFIED_BY;
  }
  if (isDeleteLogEvent(activityEvent)) {
    return DELETED_BY;
  }
  return ADDED_BY;
};

export const getDictionary = (activityEventNote: string): Record<string, string> => {
  const dictionary: Record<string, string> = {};
  const keyValSeparator = '{=}';

  let note = activityEventNote?.replace(/{mxend}/gi, '{next}');
  note = note?.replace(NOTES_MESSAGE, NOTES_MESSAGE_REPLACED);

  const pattern = /({next})/gi;
  const elements = note?.split(pattern)?.filter((item) => item);

  if (elements?.length > 0) {
    elements.forEach((item) => {
      if (item?.includes(keyValSeparator)) {
        const elemKeyValue = item?.split(keyValSeparator);
        if (elemKeyValue?.length > 1) {
          dictionary[elemKeyValue[0]] = elemKeyValue?.[1];
        }
      }
    });
  }

  return dictionary;
};

export const getContent = (activityEvent: number | undefined, activityName: string): string => {
  switch (activityEvent) {
    case ACTIVITY.DELETE_LOG:
    case ACTIVITY.ON_OPPORTUNITY_DELETE_LOG:
    case ACTIVITY.OPPORTUNITY_DELETE_LOG:
      return activityName;
    default:
      return '';
  }
};

const isTopBarActivity = (
  activityEvent: number | undefined,
  activityEventNote: string
): boolean => {
  return (
    activityEvent === ACTIVITY.TOP_BAR_VIEWED ||
    activityEvent === ACTIVITY.TOP_BAR_CTA_BUTTON_CLICKED ||
    activityEventNote?.includes(WEBWIDGETNAME)
  );
};

const getTopBarType = (note: Record<string, string>): string => {
  return MESSAGE in note ? TOPBAR : '';
};

const getCategoryType = (note: Record<string, string>): string => {
  return note && CATEGORY in note ? note?.Category : '';
};

export const getActivityType = (
  activityEventNote: string,
  activityEvent: number | undefined
): string => {
  if (activityEventNote) {
    const note = getDictionary(activityEventNote);

    if (isTopBarActivity(activityEvent, activityEventNote)) {
      return getTopBarType(note);
    } else {
      return getCategoryType(note);
    }
  }
  return '';
};

const isCancelledActivity = (additionalDetails: IAdditionalDetails): boolean => {
  const eventNote = additionalDetails?.ActivityEvent_Note || '';
  return eventNote?.includes(CANCELLED_ACTIVITY);
};

export const applyStyleToName = (data: IAugmentedAHDetail): boolean => {
  const activityEvent = data?.ActivityEvent;
  if (activityEvent === ACTIVITY.SALES) {
    const additionalDetails = data?.AdditionalDetails;
    const isSalesActivityCancelled = isCancelledActivity(additionalDetails);
    if (isSalesActivityCancelled) return true;
  }

  return false;
};

// eslint-disable-next-line complexity, max-lines-per-function
export const getActivityName = (data: IAugmentedAHDetail): string | JSX.Element => {
  const activityEvent = data?.ActivityEvent;
  const activityEventName = data?.ActivityName || data?.ActivityDisplayName || '';
  const additionalDetails = data?.AdditionalDetails;
  let name = activityEventName || <></>;

  if (additionalDetails?.ActivityEntityType === OPPORTUNITY) {
    return additionalDetails?.OpportunityName || activityEventName || '';
  }

  switch (activityEvent) {
    case ACTIVITY.PUBLISHER_TRACKING:
      name = `Portal ${activityEventName}`;
      break;
    case ACTIVITY.OPPORTUNITY_CHANGE_LOG:
      name = additionalDetails?.RelatedActivityName || activityEventName;
      break;
    case ACTIVITY.SALES:
      {
        const isSalesActivityCancelled = isCancelledActivity(additionalDetails);
        name = isSalesActivityCancelled
          ? `${activityEventName} Cancelled`
          : `${activityEventName} Added`;
      }
      break;
    case ACTIVITY.PRIVACY_COOKIE_CONSENT:
      {
        const doNotTrack =
          (safeParseJson(additionalDetails?.ActivityEvent_Note || '') as { DoNotTrack: string })
            ?.DoNotTrack || '0';
        name =
          doNotTrack === '1' ? (
            <>
              {activityEventName}
              <span className="secondary-text-color">: Opted out from tracking!</span>
            </>
          ) : (
            <>
              {activityEventName}
              <span className="secondary-text-color">: Opted in to track!</span>
            </>
          );
      }
      break;
    case ACTIVITY.DATA_PROTECTION_REQUEST:
      name = `${activityEventName}: ${additionalDetails?.ActivityExtensionStatus || ''}`;
      break;
    default:
      return name;
  }

  return name;
};
