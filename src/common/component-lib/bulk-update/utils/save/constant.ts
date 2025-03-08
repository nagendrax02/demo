import { EntityType } from 'common/types';

export const SAVE_MAPPER = {
  [EntityType.Lead]: {
    onSave: async (onSuccess: (triggerReload?: boolean) => void): Promise<void> => {
      const leadUtils = await import('../save/handle-lead-save');
      await leadUtils?.handleLeadBulkUpdate(onSuccess);
    }
  },
  [EntityType.Activity]: {
    onSave: async (onSuccess: (triggerReload?: boolean) => void): Promise<void> => {
      const leadUtils = await import('../save/handle-activity-save');
      await leadUtils?.handleActivityBulkUpdate(onSuccess);
    }
  },
  [EntityType.Opportunity]: {
    onSave: async (onSuccess: (triggerReload?: boolean) => void): Promise<void> => {
      const leadUtils = await import('../save/handle-opportunity-save');
      await leadUtils?.handleOpportunityBulkUpdate(onSuccess);
    }
  }
};
