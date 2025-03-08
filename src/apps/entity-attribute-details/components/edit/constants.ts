import { TAB_ID } from 'common/component-lib/entity-tabs/constants/tab-id';
import { PermissionEntityType } from 'common/utils/permission-manager';
import { CallerSource } from 'common/utils/rest-client';

export const permissionEntitityType = {
  [TAB_ID.LeadAttributeDetails]: {
    permissionType: PermissionEntityType.Lead,
    callerSource: CallerSource.EntityAttributeDetails
  },
  [TAB_ID.ActivityDetails]: {
    permissionType: PermissionEntityType.Opportunity,
    callerSource: CallerSource.EntityAttributeDetails
  }
};
