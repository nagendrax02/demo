import {
  IAvailableColumnConfig,
  IAvailableField
} from 'apps/smart-views/augment-tab-data/lead/tab-settings';
import { create } from 'zustand';
import { ExportType } from './tab-settings.types';
import { IFilterData } from '../../smartview-tab.types';

type SelectAndDeselect = (selectedField: IAvailableField) => void;
interface ITabSettingsActions {
  setFields: (fields: IAvailableColumnConfig[]) => void;
  setSelectedFields: (selectedFields: IAvailableField[]) => void;
  selectField: SelectAndDeselect;
  deselectField: SelectAndDeselect;
  updateSelectedFields: (selectedField: IAvailableField) => void;
  updatePinnedFields: (selectedField: IAvailableField) => void;
  setMaxAllowedSelection: (maxAllowed: number) => void;
  setSelectedExportType: (exportType: ExportType) => void;
  setEntityExportSucceeded: (isSucceeded: boolean) => void;
  setSubmitButtonDisabled: (disable: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setFilterDataMap: (data: Record<string, IFilterData>) => void;
  reset: () => void;
}

interface ITabSettingsState {
  fields: IAvailableColumnConfig[];
  selectedFields: IAvailableField[];
  actions: ITabSettingsActions;
  maxAllowedSelection: number;
  selectedExportType: ExportType;
  entityExportSucceeded: boolean;
  submitButtonDisabled: boolean;
  isLoading: boolean;
  filterDataMap: Record<string, IFilterData>;
}

const initialState = {
  fields: [],
  selectedFields: [],
  maxAllowedSelection: 60,
  selectedExportType: ExportType.AllFields,
  entityExportSucceeded: false,
  submitButtonDisabled: false,
  isLoading: false,
  filterDataMap: {}
};

interface IUpdateFields {
  fields: IAvailableColumnConfig[];
  selectedField: IAvailableField;
  selectedFieldsLength: number;
  maxAllowedSelection: number;
}

const resetPinnedColumnConfig = (metadata: IAvailableField): IAvailableField => {
  if (metadata?.columnConfigData?.pinnedColumnConfig?.canUnpin) {
    return {
      ...metadata,
      columnConfigData: {
        pinnedColumnConfig: {
          canUnpin: true,
          isPinned: false,
          showPinAction: true
        }
      }
    };
  }
  return metadata;
};

const updateMetadata = ({
  metadata,
  selectedField,
  selectedFieldsLength,
  maxAllowedSelection
}: {
  metadata: IAvailableField;
  selectedField: IAvailableField;
  selectedFieldsLength: number;
  maxAllowedSelection: number;
}): IAvailableField => {
  const updatedMetadata = resetPinnedColumnConfig(metadata);

  if (selectedField?.schemaName === updatedMetadata?.schemaName) {
    return { ...updatedMetadata, isSelected: !selectedField?.isSelected };
  }

  if (
    updatedMetadata?.columnConfigData?.pinnedColumnConfig?.canUnpin === false ||
    (selectedFieldsLength >= maxAllowedSelection && !updatedMetadata?.isSelected)
  ) {
    return { ...updatedMetadata, isDisabled: true };
  }

  if (updatedMetadata?.isDisabled && updatedMetadata?.isRestricted) {
    return updatedMetadata;
  }

  return { ...updatedMetadata, isDisabled: false };
};

const updateFieldData = ({
  field,
  selectedField,
  selectedFieldsLength,
  maxAllowedSelection
}: {
  field: IAvailableColumnConfig;
  selectedField: IAvailableField;
  selectedFieldsLength: number;
  maxAllowedSelection: number;
}): IAvailableColumnConfig => {
  return {
    ...field,
    data: field?.data?.map((metadata) =>
      updateMetadata({ metadata, selectedField, selectedFieldsLength, maxAllowedSelection })
    )
  };
};

const updateFields = ({
  fields,
  selectedField,
  selectedFieldsLength,
  maxAllowedSelection
}: IUpdateFields): IAvailableColumnConfig[] => {
  return fields?.map((field) =>
    updateFieldData({ field, selectedField, selectedFieldsLength, maxAllowedSelection })
  );
};

const updateSelectedFields = (
  selectedFields: IAvailableField[],
  selectedField: IAvailableField
): IAvailableField[] => {
  if (selectedField?.isSelected) {
    return selectedFields?.filter((item) => item?.schemaName !== selectedField?.schemaName);
  }
  return [...selectedFields, { ...selectedField, isSelected: true }];
};

const updatePinnedFields = (
  selectedFields: IAvailableField[],
  selectedField: IAvailableField
): IAvailableField[] => {
  return selectedFields?.map((item) => {
    if (item?.schemaName === selectedField?.schemaName) {
      return selectedField;
    }
    return item;
  });
};

// eslint-disable-next-line max-lines-per-function
const useTabSettingsStore = create<ITabSettingsState>((set) => ({
  ...initialState,
  actions: {
    setFields: (fields: IAvailableColumnConfig[]): void => {
      set(() => ({ fields: fields }));
    },
    setFilterDataMap: (filterDataMap: Record<string, IFilterData>): void => {
      set(() => ({ filterDataMap }));
    },

    selectField: (selectedField: IAvailableField): void => {
      set((state) => ({
        fields: updateFields({
          fields: state.fields,
          selectedField: selectedField,
          selectedFieldsLength: state?.selectedFields?.length,
          maxAllowedSelection: state?.maxAllowedSelection
        })
      }));
    },
    deselectField: (selectedField: IAvailableField): void => {
      set((state) => ({
        fields: updateFields({
          fields: state.fields,
          selectedField: selectedField,
          selectedFieldsLength: state?.selectedFields?.length,
          maxAllowedSelection: state?.maxAllowedSelection
        })
      }));
    },
    setSelectedFields: (selectedFields: IAvailableField[]): void => {
      set(() => ({ selectedFields: selectedFields }));
    },
    updateSelectedFields: (selectedField: IAvailableField): void => {
      set((state) => ({
        selectedFields: updateSelectedFields(state?.selectedFields, selectedField)
      }));
    },
    updatePinnedFields: (selectedField: IAvailableField): void => {
      set((state) => ({
        selectedFields: updatePinnedFields(state?.selectedFields, selectedField)
      }));
    },
    setMaxAllowedSelection: (maxAllowed: number): void => {
      set(() => ({
        maxAllowedSelection: maxAllowed
      }));
    },

    setSelectedExportType: (exportType: ExportType): void => {
      set(() => ({
        selectedExportType: exportType
      }));
    },

    setEntityExportSucceeded: (isSucceeded: boolean): void => {
      set(() => ({
        entityExportSucceeded: isSucceeded
      }));
    },

    setSubmitButtonDisabled: (disable: boolean): void => {
      set(() => ({
        submitButtonDisabled: disable
      }));
    },

    setIsLoading: (loading: boolean): void => {
      set(() => ({
        isLoading: loading
      }));
    },

    reset: (): void => {
      set(() => ({ ...initialState }));
    }
  }
}));

const useFields = (): IAvailableColumnConfig[] => useTabSettingsStore((state) => state?.fields);
const useSelectedFields = (): IAvailableField[] =>
  useTabSettingsStore((state) => state?.selectedFields);
const useTabSettingsActions = (): ITabSettingsActions =>
  useTabSettingsStore((state) => state?.actions);
const useMaxAllowedSelection = (): number =>
  useTabSettingsStore((state) => state?.maxAllowedSelection);

export default useTabSettingsStore;
export { useFields, useSelectedFields, useTabSettingsActions, useMaxAllowedSelection };
