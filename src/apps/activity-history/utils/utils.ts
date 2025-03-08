/* eslint-disable complexity */
import { safeParseJson } from '../../../common/utils/helpers';
import { ActivityRenderType, IActivityHistoryDetail, IAugmentedAHDetail } from '../types';
import augmentedActivityDetails from './augmented-activity-details';
import {
  ACTIVITY,
  ACTIVITY_TYPE,
  LEAD_AUDIT_EVENT_CODES,
  OPP_AUDIT_EVENT_CODES,
  DELETE_AUDIT_EVENT_CODES
} from '../constants';
import { EntityType } from 'src/common/types';
import { IActionModal } from '../types/activity-history-store.types';
import {
  ExperienceType,
  endExperienceEvent,
  getExperienceKey,
  startExperienceEvent
} from 'common/utils/experience';
import { EntityDetailsEvents } from 'common/utils/experience';

const parseAdditionalDetails = (additionalDetails?: string): Record<string, string> | null => {
  return safeParseJson(additionalDetails || '') as Record<string, string>;
};

const getRenderTypeForLeadAuditActivity = (event: number): ActivityRenderType | null => {
  if (LEAD_AUDIT_EVENT_CODES.includes(event)) return ActivityRenderType.LeadAudit;
  return null;
};

const getRenderTypeForOppAuditActivity = (event: number): ActivityRenderType | null => {
  if (OPP_AUDIT_EVENT_CODES.includes(event)) return ActivityRenderType.OpportunityAudit;
  return null;
};

const getRenderTypeForDeleteLogsActivity = (event: number): ActivityRenderType | null => {
  if (DELETE_AUDIT_EVENT_CODES.includes(event)) return ActivityRenderType.DeleteLogs;
  return null;
};

const getRenderTypeForAuditActivity = (event: number): ActivityRenderType | null => {
  const leadAuditRenderType = getRenderTypeForLeadAuditActivity(event);
  if (leadAuditRenderType !== null) return leadAuditRenderType;

  const oppAuditRenderType = getRenderTypeForOppAuditActivity(event);
  if (oppAuditRenderType !== null) return oppAuditRenderType;

  return null;
};

const getRenderTypeForActivityEvent = (event: number): ActivityRenderType | null => {
  const auditRenderType = getRenderTypeForAuditActivity(event);
  if (auditRenderType !== null) return auditRenderType;

  const deleteLogsRenderType = getRenderTypeForDeleteLogsActivity(event);
  if (deleteLogsRenderType !== null) return deleteLogsRenderType;

  if (
    event === ACTIVITY.CHANGE_LOG ||
    event === ACTIVITY.OPPORTUNITY_CHANGE_LOG ||
    event === ACTIVITY.SALES
  )
    return ActivityRenderType.Custom;

  if (event === ACTIVITY.TASK) return ActivityRenderType.Task;
  if (event === ACTIVITY.NOTES || event === ACTIVITY.OPPORTUNITY_NOTES)
    return ActivityRenderType.Note;

  if (event === ACTIVITY.LEAD_CAPTURE) return ActivityRenderType.LeadCapture;

  if (event === ACTIVITY.DUPLICATE_OPP_DETECTED || event === ACTIVITY.OPPORTUNITY_CAPTURE)
    return ActivityRenderType.Opportunity;
  return null;
};

const getRenderTypeGDPRActivity = (event: number): ActivityRenderType | null => {
  if (
    event === ACTIVITY.OPTED_IN_FOR_EMAIL ||
    event === ACTIVITY.OPTED_OUT_FOR_EMAIL ||
    event === ACTIVITY.DO_NOT_TRACK_REQUEST
  )
    return ActivityRenderType.Privacy;

  if (event === ACTIVITY.PRIVACY_COOKIE_CONSENT || event === ACTIVITY.DATA_PROTECTION_REQUEST)
    return ActivityRenderType.Custom;

  return null;
};

const getRenderTypePortalActivity = (event: number): ActivityRenderType | null => {
  if (
    event === ACTIVITY.LOGGED_INTO_PORTAL ||
    event === ACTIVITY.LOGGED_OUT_PORTAL ||
    event === ACTIVITY.FORGOT_PASSWORD ||
    event == ACTIVITY.CHANGED_PASSWORD_OF_PORTAL
  )
    return ActivityRenderType.Portal;

  if (
    event === ACTIVITY.PUBLISHER_TRACKING ||
    event === ACTIVITY.REGISTER_ON_PORTAL ||
    event === ACTIVITY.FORM_SAVED_AS_DRAFT_ON_PORTAL
  )
    return ActivityRenderType.Custom;

  return null;
};

const getRenderTypeForActivityType = (type: number, event: number): ActivityRenderType | null => {
  if (type === ACTIVITY_TYPE.EMAIL_SENT) return ActivityRenderType.Email;

  if (type === ACTIVITY_TYPE.WEB_ACTIVITY) return ActivityRenderType.Web;

  if (type === ACTIVITY_TYPE.PHONE_ACTIVITY) return ActivityRenderType.Phone;

  if (type === ACTIVITY_TYPE.GDPR_ACTIVITY) {
    const gdprRenderType = getRenderTypeGDPRActivity(event);
    if (gdprRenderType !== null) return gdprRenderType;
  }

  if (type === ACTIVITY_TYPE.PORTAL_ACTIVITY) {
    const portalRenderType = getRenderTypePortalActivity(event);
    if (portalRenderType !== null) return portalRenderType;
  }

  if (type === ACTIVITY_TYPE.DYNAMIC_FORM) return ActivityRenderType.DynamicForm;

  if (type === ACTIVITY_TYPE.CUSTOM_ACTIVITY) return ActivityRenderType.Custom;

  if (!type) return ActivityRenderType.Email;

  return ActivityRenderType.Default;
};

const getAugmentedAHDetails = async (
  data: IActivityHistoryDetail[],
  type: EntityType,
  isActivityHistory?: boolean
): Promise<IAugmentedAHDetail[]> => {
  const experienceConfig = getExperienceKey();
  if (isActivityHistory) {
    startExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.ActivityDataAugmentation,
      key: experienceConfig.key
    });
  }

  const augmentedAHDetails = (await Promise.all(
    data.flatMap(async (item) => {
      const renderType =
        getRenderTypeForActivityEvent(item.ActivityEvent) ||
        getRenderTypeForActivityType(item.ActivityType, item.ActivityEvent);
      if (renderType) {
        const augmentedActivityDetail = augmentedActivityDetails()[renderType](item, type);
        return augmentedActivityDetail;
      }
      return [];
    })
  )) as IAugmentedAHDetail[];

  if (isActivityHistory) {
    endExperienceEvent({
      module: experienceConfig.module,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.ActivityDataAugmentation,
      key: experienceConfig.key
    });
  }

  return augmentedAHDetails;
};

const handleActionModal = (
  actions: IActionModal,
  actionType: string,
  visibility: boolean
): IActionModal => {
  const clonedActions = { ...actions };

  Object.entries(actions).forEach(([label]) => {
    if (label === actionType && typeof clonedActions[actionType] === 'boolean') {
      clonedActions[label] = visibility;
    } else {
      clonedActions[label] = false;
    }
  });

  return clonedActions;
};

export { parseAdditionalDetails, getAugmentedAHDetails, handleActionModal };
