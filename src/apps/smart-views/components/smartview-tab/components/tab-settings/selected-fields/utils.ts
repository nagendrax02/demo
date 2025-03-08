import { IAvailableField } from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { HeaderAction, SCHEMA_NAMES, TabType } from 'apps/smart-views/constants/constants';
import { DataType, RenderType } from 'common/types/entity/lead';
import { redundantOpportunityFields } from '../constants';
import { MAX_PINNED_COLUMN_LIMIT } from './constants';
import { produce } from 'immer';

export const getFilteredSelectedFields = ({
  selectedAction,
  selectedFields,
  tabType
}: {
  selectedAction: IMenuItem | null;
  selectedFields: IAvailableField[];
  tabType: TabType;
}): IAvailableField[] => {
  if (!selectedFields?.length) return [];

  const isExportAction = selectedAction?.value === HeaderAction.ExportLeads;
  const isFileField = (field: IAvailableField): boolean => field?.dataType === DataType.File;
  const isLeadRenderType = (field: IAvailableField): boolean =>
    field?.renderType === RenderType.Lead;
  const isCFSAndActivityType = (field: IAvailableField): boolean | undefined =>
    field?.isCFS && field?.type === TabType.Activity;
  const isAccountTabAndIdentifier = (field: IAvailableField): boolean =>
    tabType === TabType.Account && field?.schemaName === SCHEMA_NAMES.ACCOUNT_IDENTIFIER;
  const isOpportunityTabAndRedundantField = (field: IAvailableField): boolean | undefined =>
    tabType === TabType.Opportunity &&
    (redundantOpportunityFields.includes(field?.schemaName) ||
      (field.renderType === RenderType.Lead && field.isCFS));

  if (isExportAction) {
    return selectedFields.filter(
      (field) =>
        !(
          isFileField(field) ||
          (isLeadRenderType(field) && isCFSAndActivityType(field)) ||
          isAccountTabAndIdentifier(field) ||
          isOpportunityTabAndRedundantField(field)
        )
    );
  }

  return selectedFields;
};

const hasReachedPinnedFieldsMaxLimit = (selectedFields: IAvailableField[]): boolean => {
  const pinnedFieldsLength = selectedFields?.filter(
    (field) => field?.columnConfigData?.pinnedColumnConfig?.isPinned
  )?.length;

  return pinnedFieldsLength >= MAX_PINNED_COLUMN_LIMIT;
};

interface IPinnedFields {
  pinnedFields: IAvailableField[];
  scrollableFields: IAvailableField[];
}

const getAugmentedColumnConfig = (
  field: IAvailableField,
  hasReachedMaxPinnedLimit: boolean,
  isDisabled: boolean
): IAvailableField => {
  const updatedField = produce(field, (draft) => {
    draft.isDisabled = isDisabled;
    if (!draft.columnConfigData) {
      draft.columnConfigData = {};
    }
    if (!draft.columnConfigData.pinnedColumnConfig) {
      draft.columnConfigData.pinnedColumnConfig = {};
    }
    draft.columnConfigData.pinnedColumnConfig.hasReachedMaxPinnedLimit =
      hasReachedMaxPinnedLimit && !draft.columnConfigData.pinnedColumnConfig.isPinned;
  });

  return updatedField;
};

export const getPinnedFields = (selectedFields: IAvailableField[]): IPinnedFields => {
  const pinnedFields: IAvailableField[] = [];
  const scrollableFields: IAvailableField[] = [];

  const pinnedFieldsMaxLimitReached = hasReachedPinnedFieldsMaxLimit(selectedFields);

  selectedFields.forEach((field) => {
    if (field?.columnConfigData?.pinnedColumnConfig?.isPinned) {
      pinnedFields.push(getAugmentedColumnConfig(field, pinnedFieldsMaxLimitReached, true));
    } else {
      scrollableFields.push(getAugmentedColumnConfig(field, pinnedFieldsMaxLimitReached, false));
    }
  });

  return {
    pinnedFields,
    scrollableFields
  };
};
