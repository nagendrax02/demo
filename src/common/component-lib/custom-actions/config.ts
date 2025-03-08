import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { IConfig, IEntitySchema } from './cutom-actions.types';

const addConfig = (
  mailMergeConfig: IConfig,
  records: Record<string, unknown>[],
  schemas: IEntitySchema
): IConfig => {
  const addToList = (
    idList: string[],
    record: Record<string, unknown>,
    schema: string | undefined
  ): void => {
    if (schema && record?.[schema]) {
      idList.push(record[schema] as string);
    }
  };

  const getIds = (ids: string[]): string[] | undefined => {
    return ids.length ? ids : undefined;
  };

  const leadIds = [];
  const opportunityIds = [];
  const taskIds = [];
  const activityIds = [];

  records.forEach((record) => {
    addToList(leadIds, record, schemas.lead);
    addToList(opportunityIds, record, schemas.opportunity);
    addToList(taskIds, record, schemas.task);
    addToList(activityIds, record, schemas.activity);
  });

  return {
    ...mailMergeConfig,
    leadIds: getIds(leadIds),
    opportunityIds: getIds(opportunityIds),
    taskIds: getIds(taskIds),
    activityIds: getIds(activityIds)
  };
};

const addActivityConfig = (
  mailMergeConfig: IConfig,
  records: Record<string, unknown>[]
): IConfig => {
  return addConfig(mailMergeConfig, records, {
    lead: 'ProspectId',
    opportunity: 'RelatedActivityId',
    activity: 'ProspectActivityId'
  });
};

const addOpportunityConfig = (
  mailMergeConfig: IConfig,
  records: Record<string, unknown>[],
  coreData?: IEntityDetailsCoreData
): IConfig => {
  let updatedRecords = records;

  // Getting entityIds from coreData is to handle custom connector actions mail merge for opportunity details
  if (records?.length === 1 && coreData) {
    updatedRecords = records.map((record) => ({
      ...record,
      ProspectId: record?.ProspectId ?? coreData.entityIds?.lead,
      ProspectActivityId: record?.ProspectActivityId ?? coreData.entityIds?.opportunity
    }));
  }

  return addConfig(mailMergeConfig, updatedRecords, {
    lead: 'ProspectId',
    opportunity: 'ProspectActivityId'
  });
};

const addTaskConfig = (mailMergeConfig: IConfig, records: Record<string, unknown>[]): IConfig => {
  return addConfig(mailMergeConfig, records, {
    lead: 'RelatedEntityId',
    opportunity: 'RelatedActivityId',
    task: 'UserTaskId'
  });
};

const addLeadConfig = (mailMergeConfig: IConfig, records: Record<string, unknown>[]): IConfig => {
  return addConfig(mailMergeConfig, records, {
    lead: 'ProspectID'
  });
};

export { addActivityConfig, addOpportunityConfig, addTaskConfig, addLeadConfig };
