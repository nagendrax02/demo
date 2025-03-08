import { DataType, ILeadAttribute, RenderType } from 'common/types/entity/lead';
import { OPP_DATA_TYPE_MAP, OPP_RENDER_TYPE_MAP } from './constants';
import { IActivityAttribute } from 'common/utils/entity-data-manager/activity/activity.types';
import { IActionConfig, SOCIAL_MEDIA } from '../../../types/entity-data.types';
import { EntityType, IEntity, IOpportunity } from 'common/types';
import { getEntityId, getOpportunityEventCode } from 'common/utils/helpers';
import { ACTION } from '../../../constants';
import { SchemaName } from 'common/types/entity/lead/metadata.types';

const schemeNameRenderTypeMap: Record<string, RenderType> = {
  CreatedBy: RenderType.Text,
  ModifiedBy: RenderType.Text,
  Owner: RenderType.Text,
  OwnerId: RenderType.UserName,
  Status: RenderType.OpportunityStatus,
  TimeZone: RenderType.TimeZone,
  PhotoUrl: RenderType.URL
};

const getRenderTypeBasedonSchemeName = (
  field: ILeadAttribute | IActivityAttribute
): RenderType | undefined => {
  if (schemeNameRenderTypeMap?.[field?.SchemaName]) {
    return schemeNameRenderTypeMap?.[field?.SchemaName];
  }

  switch ((field as IActivityAttribute)?.InternalSchemaName) {
    case 'OpportunitySourceName':
      return RenderType.OpportunitySource;
  }
};

const getSocialMediaRenderTypeFields = (
  field: ILeadAttribute | IActivityAttribute
): RenderType | undefined => {
  if (SOCIAL_MEDIA.includes(field?.SchemaName?.toLocaleLowerCase())) {
    return RenderType.SocialMedia;
  }
};

const getValidRenderType = (field: ILeadAttribute | IActivityAttribute): RenderType => {
  let schemaRenderType = getRenderTypeBasedonSchemeName(field);

  if (schemaRenderType) {
    return schemaRenderType;
  }

  schemaRenderType = getSocialMediaRenderTypeFields(field);

  if (schemaRenderType) {
    return schemaRenderType;
  }

  const type =
    field?.RenderType && field?.RenderType !== RenderType.None
      ? field?.RenderType
      : field?.DataType;
  if (field?.SchemaName === SchemaName.RelatedCompanyId) return RenderType.Account;
  if (OPP_RENDER_TYPE_MAP?.[type]) {
    return OPP_RENDER_TYPE_MAP?.[type];
  }
  return RenderType.Text;
};

const getValidDataType = (field: ILeadAttribute | IActivityAttribute): DataType => {
  switch (field?.SchemaName) {
    case 'CreatedBy':
    case 'ModifiedBy':
    case 'Owner':
      return DataType.Text;
    case 'OwnerId':
      return DataType.ActiveUsers;
  }

  const type = field?.DataType;
  if (OPP_DATA_TYPE_MAP?.[type]) {
    return OPP_DATA_TYPE_MAP?.[type];
  }
  return DataType.Text;
};

const getLeadAge = (age?: string): string => {
  if (Number(age) > 1) {
    return `${age} days`;
  }
  return `${age} day`;
};

const getLeadName = (leadFields?: Record<string, string | null> | null): string => {
  if (leadFields?.FirstName || leadFields?.LastName) {
    return `${leadFields?.FirstName || ''} ${leadFields?.LastName || ''}`.trim();
  }

  if (leadFields?.EmailAddress) {
    return leadFields?.EmailAddress;
  }

  if (leadFields?.Phone) {
    return leadFields?.Phone;
  }

  return `[No Name]`;
};

const getPermissionEntityId = (type: EntityType): string => {
  if (type === EntityType.Opportunity) {
    return `${getOpportunityEventCode()}`;
  }
  return getEntityId();
};

const getCanUpdateValue = (type: EntityType, data: IEntity): boolean => {
  if (type === EntityType.Opportunity) {
    return true;
  }
  return data?.details?.Fields?.CanUpdate?.toLowerCase() === 'true';
};

const updateRestrictedActions: Record<string, boolean> = {
  [ACTION.Change_Status_Stage]: true,
  [ACTION.ChangeOwner]: true,
  [ACTION.Edit]: true
};

const oppRestrictedActions: Record<string, boolean> = {
  [ACTION.Change_Status_Stage]: true,
  [ACTION.ChangeOwner]: true,
  [ACTION.Edit]: true,
  [ACTION.Activity]: true,
  [ACTION.Tasks]: true,
  [ACTION.Note]: true
};

const isOppActionRestricted = (
  entityData: IOpportunity,
  action: IActionConfig,
  isUpdateRestricted?: boolean
): boolean => {
  const isOppRestricted = entityData?.details?.IsRestricted
    ? entityData?.details?.IsRestricted
    : false;

  if (isOppRestricted && oppRestrictedActions?.[action.id]) {
    return true;
  } else if (isUpdateRestricted && updateRestrictedActions?.[action?.id]) {
    return true;
  }

  return false;
};

export {
  getValidRenderType,
  getValidDataType,
  getLeadAge,
  getLeadName,
  getPermissionEntityId,
  getCanUpdateValue,
  isOppActionRestricted
};
