import { RenderType } from 'common/types/entity/lead';
import {
  AugmentedRenderType,
  DataType,
  IMetaDataField,
  RenderTypeCode,
  Schema
} from '../bulk-update.types';
import { InternalSchema } from 'common/types/entity/lead/metadata.types';

const SCHEMA_BASED = {
  [Schema.RelatedCompanyId?.toLowerCase()]: AugmentedRenderType.AssociatedDropdown,
  [Schema.OwnerId?.toLowerCase()]: AugmentedRenderType.ActiveUsers,
  [Schema.Owner?.toLowerCase()]: AugmentedRenderType.ActiveUsers,
  [Schema.MailingPreferences?.toLowerCase()]: AugmentedRenderType.MultiselectDropdown,
  [Schema.Stage?.toLowerCase()]: AugmentedRenderType.ChangeStage,
  [Schema.ProspectStage?.toLowerCase()]: AugmentedRenderType.ChangeStage,
  [InternalSchema.OpportunityReason?.toLowerCase()]: AugmentedRenderType.ChangeStatus
};

const DATA_TYPE_BASED = {
  [DataType.Number?.toLowerCase()]: AugmentedRenderType.Number,
  [DataType.ActiveUsers?.toLowerCase()]: AugmentedRenderType.ActiveUsers,
  [DataType.Product?.toLowerCase()]: AugmentedRenderType.Product,
  [DataType.LargeOptionSet?.toLowerCase()]: AugmentedRenderType.LargeOptionSet
};

const RENDER_TYPE_BASED = {
  [RenderType.TextArea?.toLowerCase()]: AugmentedRenderType.TextArea,
  [RenderType.HTML?.toLowerCase()]: AugmentedRenderType.Editor,
  [RenderTypeCode.HTML?.toLowerCase()]: AugmentedRenderType.Editor,
  [RenderType.RadioButtons?.toLowerCase()]: AugmentedRenderType.RadioButtons,
  [RenderType.Checkbox?.toLowerCase()]: AugmentedRenderType.Checkbox,
  [RenderType.Date?.toLowerCase()]: AugmentedRenderType.Date,
  [RenderType.DateTime?.toLowerCase()]: AugmentedRenderType.DateTime,
  [RenderType.Time?.toLowerCase()]: AugmentedRenderType.Time,
  [RenderType.Phone?.toLowerCase()]: AugmentedRenderType.Phone,
  [RenderType.Email?.toLowerCase()]: AugmentedRenderType.Email,
  [RenderType.Dropdown?.toLowerCase()]: AugmentedRenderType.Dropdown,
  [RenderType.DropdownWithOthers?.toLowerCase()]: AugmentedRenderType.DropdownWithOthers,
  [RenderType.ActiveUsers?.toLowerCase()]: AugmentedRenderType.ActiveUsers,
  [RenderType.SearchableDropdown?.toLowerCase()]: AugmentedRenderType.SearchableDropDown,
  [RenderType?.LargeOptionSet?.toLowerCase()]: AugmentedRenderType.LargeOptionSet,
  [RenderType?.MultiSelect?.toLowerCase()]: AugmentedRenderType.MultiselectDropdown,
  [RenderType?.Product?.toLowerCase()]: AugmentedRenderType.Product
};

const getSchema = (field: IMetaDataField): string => {
  return field?.InternalSchemaName === InternalSchema.OpportunityReason
    ? InternalSchema.OpportunityReason
    : field?.SchemaName;
};

// eslint-disable-next-line complexity
export const getAugmentedRenderer = (
  field: IMetaDataField,
  isCFS: boolean
): AugmentedRenderType => {
  const schema = getSchema(field);

  if (schema === Schema.ActivityEventNote && field.RenderType !== RenderTypeCode.HTML) {
    return AugmentedRenderType.TextArea;
  }

  const renderer =
    SCHEMA_BASED[schema?.toLowerCase()] ||
    DATA_TYPE_BASED[field?.DataType?.toLowerCase()] ||
    (field?.IsMultiSelectDropdown
      ? AugmentedRenderType.MultiselectDropdown
      : RENDER_TYPE_BASED[
          isCFS
            ? field?.DataType?.toLowerCase()
            : field?.RenderType?.toLowerCase() || field?.DataType?.toLowerCase()
        ]);

  return renderer || AugmentedRenderType.TextBox;
};
