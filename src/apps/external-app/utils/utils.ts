import { trackError } from 'common/utils/experience/utils/track-error';
import { IAssociatedEntityDetails } from 'apps/entity-details/types/entity-data.types';
import { publishExternalAppEvent } from '../event-handler';

const triggerClick2Call = ({
  associatedEntityDetails,
  leadId,
  phoneNumber,
  schemaName,
  leadName
}: {
  leadName: string;
  schemaName: string;
  phoneNumber: string;
  leadId: string;
  associatedEntityDetails?: IAssociatedEntityDetails;
}): void => {
  try {
    const replaceKey = 'P_';
    publishExternalAppEvent('lsq-marvin-click-2-call', {
      data: {
        phoneNumber: phoneNumber,
        schemaName: schemaName?.startsWith(replaceKey)
          ? schemaName?.replace(replaceKey, '')
          : schemaName,
        leadId: leadId,
        leadName: leadName,
        entityType: 'lead',
        associatedEntityDetails
      }
    });
  } catch (error) {
    trackError(error);
  }
};

export const triggerEntityClick2Call = ({
  fields,
  phoneNumber,
  schemaName,
  associatedEntityDetails
}: {
  fields: Record<string, string | null> | undefined;
  phoneNumber: string;
  schemaName: string;
  associatedEntityDetails?: IAssociatedEntityDetails;
}): void => {
  const leadId = fields?.ProspectID || fields?.P_ProspectID || fields?.ProspectId || '';
  const leadName = `${fields?.FirstName || fields?.RelatedEntityIdName || ''} ${
    fields?.LastName || ''
  }`;

  triggerClick2Call({
    leadId,
    leadName,
    phoneNumber: phoneNumber,
    schemaName: schemaName,
    associatedEntityDetails
  });
};

export const triggerConverse = (leadId: string, leadName: string): void => {
  try {
    const payload = {
      data: {
        appId: 'converse-app-widget',
        contactType: 2,
        identityID: leadId,
        contactName: leadName || '[No Name]'
      },
      event: 'click'
    };

    publishExternalAppEvent('lsq-marvin-trigger-app-action', payload);
  } catch (error) {
    trackError(error);
  }
};

export const isFeatureEnabled = (key: string): boolean => {
  try {
    return Number(localStorage.getItem(key)) === 1;
  } catch (error) {
    trackError(error);
  }
  return false;
};
