import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IBulkUpdateField, IBulkUpdateHelper, IMetaDataGet } from './bulk-update.types';
import {
  augmentedLeadFields,
  getBulkUpdateSettingsConfig,
  getLeadBulkUpdateConfig,
  getLeadMetaData,
  leadDropdownOptionGet
} from './utils/lead-helper';
import { ILeadAttribute } from 'common/types/entity/lead';
import { PermissionEntityType } from 'common/utils/permission-manager';
import {
  activityDropdownOptionGet,
  augmentedActivityFields,
  getActivityBulkUpdateConfig,
  getActivityMetaData
} from './utils/activity-helper';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import {
  augmentedOpportunityFields,
  getOpportunityBulkUpdateConfig,
  getOpportunityMetaData,
  opportunityDropdownOptionGet
} from './utils/opportunity/opportunity-helper';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

export const BULK_UPDATE_HELPER: IBulkUpdateHelper = {
  [EntityType.Lead]: {
    bulkUpdateConfigGet: getLeadBulkUpdateConfig,
    metaDataGet: async (
      ...args: [eventCode?: number | undefined, leadTypeConfiguration?: ILeadTypeConfiguration[]]
    ): Promise<IMetaDataGet> => {
      const leadTypeConfiguration = args[1];
      const metaData = await getLeadMetaData(CallerSource.BulkUpdate, leadTypeConfiguration);
      return metaData;
    },
    augmenter: (field: ILeadAttribute): IBulkUpdateField[] => augmentedLeadFields(field),
    settingConfigGet: getBulkUpdateSettingsConfig,
    dropdownOptionGet: leadDropdownOptionGet,
    canSortFields: true
  },
  [EntityType.Activity]: {
    bulkUpdateConfigGet: getActivityBulkUpdateConfig,
    metaDataGet: async (eventCode: number): Promise<IMetaDataGet> => {
      const metaData = await getActivityMetaData(eventCode, CallerSource.BulkUpdate);
      return metaData;
    },
    augmenter: (field: IActivityAttribute): IBulkUpdateField[] => augmentedActivityFields(field),
    settingConfigGet: getBulkUpdateSettingsConfig,
    dropdownOptionGet: activityDropdownOptionGet,
    canSortFields: false
  },
  [EntityType.Opportunity]: {
    bulkUpdateConfigGet: getOpportunityBulkUpdateConfig,
    metaDataGet: async (eventCode: number): Promise<IMetaDataGet> => {
      const metaData = await getOpportunityMetaData(eventCode, CallerSource.BulkUpdate);
      return metaData;
    },
    augmenter: (field: IActivityAttribute): IBulkUpdateField[] => augmentedOpportunityFields(field),
    settingConfigGet: getBulkUpdateSettingsConfig,
    dropdownOptionGet: opportunityDropdownOptionGet,
    canSortFields: false
  }
};

export const PERMISSION_ENTITY_TYPE: Record<string, PermissionEntityType> = {
  [EntityType?.Lead]: PermissionEntityType.Lead,
  [EntityType?.Activity]: PermissionEntityType.Activity,
  [EntityType?.Opportunity]: PermissionEntityType.Opportunity
};

export const SCHEMA = {
  DoNotTrack: 'DoNotTrack',
  ProspectStage: 'ProspectStage',
  RelatedCompanyId: 'RelatedCompanyId',
  TimeZone: 'TimeZone'
};

export const ASSOCIATE_ACCOUNT_DISPLAY_CONFIG = {
  titleKeys: ['AccountName'],
  body: [
    { key: 'AccountTypeName', label: 'Account Type Name' },
    { key: 'Phone', label: 'Phone' },
    { key: 'Address', label: 'Address' }
  ]
};

export const UPDATE_ALL_ENTITY = {
  SUCCESS_MODAL_TITLE: 'Update All {entityPluralName} Request',
  SUCCESS_MESSAGE: `Your request to update list of {entityPluralName} has been queued`,
  SUCCESS_DESCRIPTION:
    'As soon as the list is refreshed, we will intimate you through email with the status of your request',
  NOTE_MESSAGE: 'Changes will be applicable to all the leads present in this list'
};

export const SEARCH_PARAMS_STRING =
  '{"GrpConOp":"and","QueryTimeZone":"India Standard Time","Conditions":[]}';

export const UNSUPPORTED_ACTIVITY_NOTE = [30, 31, 21, 22];
export const MXDuplicateEntryException = 'MXDuplicateEntryException';

export const NUMBER_LIMIT: Record<string, { Min: number; Max: number }> = {
  [EntityType.Lead]: {
    Min: -2147483648,
    Max: 2147483647
  },
  [EntityType.Activity]: {
    Min: -9999999999,
    Max: 9999999999
  },
  [EntityType.Opportunity]: {
    Min: -9999999999,
    Max: 9999999999
  }
};
