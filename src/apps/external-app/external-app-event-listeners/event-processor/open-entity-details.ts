import { trackError } from 'common/utils/experience/utils/track-error';
import { EntityType } from 'common/types';
import { getEntityId, isMiP } from '../../../../common/utils/helpers';
import {
  getOpportunityId,
  openEntityDetailsPagesInPlatform,
  openEntityDetailsPagesInStandalone
} from 'common/utils/helpers/helpers';
import { publishExternalAppEvent } from 'apps/external-app/event-handler';
import { openAccountDetailTab } from 'common/utils/helpers/account';

interface IEventPayload {
  entityType: unknown;
  entityId: string;
  entityDetails: Record<string, string | number>;
  additionalData: unknown;
}

// const eventCheck = (entityDetails): string => {
//   return (entityDetails?.OpportunityEvent || entityDetails?.opportunityEvent) as string;
// };

// const activityCodeCheck = (entityDetails): string => {
//   return (entityDetails?.ActivityCode || entityDetails?.activityCode) as string;
// };

// const getOpportunityEventCode = (entityDetails): string => {
//   return (entityDetails?.event ||
//     eventCheck(entityDetails) ||
//     activityCodeCheck(entityDetails) ||
//     entityDetails?.Code ||
//     entityDetails?.code ||
//     entityDetails?.TypeId ||
//     entityDetails?.typeId) as string;
// };

const openLeadTab = (entityId: string, openInNewTab?: boolean): void => {
  if (isMiP()) {
    if (entityId !== getEntityId()) {
      openEntityDetailsPagesInPlatform({ entity: EntityType.Lead, id: entityId, openInNewTab });
    }
    return;
  } else {
    openEntityDetailsPagesInStandalone({ entity: EntityType.Lead, id: entityId, openInNewTab });
    return;
  }
  //Open Marvin Tab
};

// eslint-disable-next-line complexity
const openOpportunityTab = (
  entityId: string,
  entityDetails: Record<string, string | number>,
  openInNewTab?: boolean
): void => {
  const eventCode =
    entityDetails?.event ||
    entityDetails?.OpportunityEvent ||
    entityDetails?.opportunityEvent ||
    entityDetails?.ActivityCode ||
    entityDetails?.activityCode ||
    entityDetails?.Code ||
    entityDetails?.code ||
    entityDetails?.TypeId ||
    entityDetails?.typeId;

  if (isMiP()) {
    if (entityId !== getOpportunityId()) {
      openEntityDetailsPagesInPlatform({
        entity: EntityType.Opportunity,
        id: entityId,
        eventCode,
        openInNewTab
      });
    }
    return;
  } else {
    openEntityDetailsPagesInStandalone({
      entity: EntityType.Opportunity,
      id: entityId,
      eventCode,
      openInNewTab
    });
    return;
  }
  //Open Marvin tab
};

const openTicketTab = (event: MessageEvent): void => {
  publishExternalAppEvent('broadcast-external-action', {
    data: {
      type: 'open-entity-details',
      payload: event.data.payload as unknown
    }
  });
};

const openEntityDetailsProcessor = (event: MessageEvent): void => {
  try {
    if (!event?.data?.payload) {
      return;
    }
    const { entityType, entityId, entityDetails } = event.data.payload as IEventPayload;

    switch (entityType) {
      case 'LEAD':
        openLeadTab(entityId, true);
        break;
      case 'OPPORTUNITY':
        openOpportunityTab(entityId, entityDetails, true);
        break;
      case 'TICKET':
        openTicketTab(event);
        break;
      case 'ACCOUNT':
        openAccountDetailTab({
          accountId: entityId,
          accountTypeName: entityDetails?.accountTypeName as string,
          accountTypeCode: entityDetails?.accountType as string,
          openInNewTab: true
        });
        break;
      default:
        break;
    }
  } catch (ex) {
    trackError('Error in openEntityDetailsProcessor :', ex);
  }
};

export default openEntityDetailsProcessor;
