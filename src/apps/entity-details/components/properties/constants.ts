import { EntityType } from 'common/types';
import { PermissionEntityType } from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';

export const permissionEntitityType = {
  [EntityType.Lead]: {
    permissionType: PermissionEntityType.Lead,
    callerSource: CallerSource.LeadDetailsProperties
  },
  [EntityType.Opportunity]: {
    permissionType: PermissionEntityType.Opportunity,
    callerSource: CallerSource.OpportunityDetailsProperties
  },
  [EntityType.Account]: {
    permissionType: PermissionEntityType.Accounts,
    callerSource: CallerSource.AccountDetailsProperties
  }
};
