import { create } from 'zustand';
import {
  BulkMode,
  IBulkUpdateField,
  IGridConfig,
  ISearchParams,
  ISettings,
  InputId
} from './bulk-update.types';
import { EntityType } from 'common/types';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';

export interface IUpdate {
  value: string;
  isValidInput?: boolean;
  date?: string;
  time?: string;
  comment?: string;
  accountId?: string;
  accountTypeId?: string;
}

interface IInitGridConfig {
  searchParams: ISearchParams;
  gridConfig: IGridConfig;
  entityIds: string[];
  entityType: EntityType;
  callerSource: CallerSource;
  eventCode?: string;
}

interface IBulkUpdateCOnfig {
  fields: IBulkUpdateField[];
  settings: ISettings;
}
export type SelectionMode = BulkMode;
export interface IBulkSelectionMode {
  mode?: SelectionMode;
  nLead?: string;
}

interface IPartialSuccess {
  showCount: boolean;
  successCount?: number;
  failureCount?: number;
}
interface IUseBulkUpdate {
  setSelectedField: (field: IBulkUpdateField[]) => void;
  setUpdateTo: (field: IUpdate) => void;
  updatedTo: IUpdate;
  bulkSelectionMode: IBulkSelectionMode;
  setBulkSelectionMode: (value: IBulkSelectionMode) => void;
  error: InputId;
  initGridConfig: IInitGridConfig;
  bulkUpdateConfig: IBulkUpdateCOnfig;
  isAsyncRequest: boolean;
  representationName: IEntityRepresentationName;
  errorMessage?: string;
  selectedField?: IBulkUpdateField | null;
  partialSuccess?: IPartialSuccess;
}

const initialStateValue = {
  selectedField: null,
  updatedTo: { value: '' },
  bulkSelectionMode: {},
  error: InputId.Invalid,
  initGridConfig: {} as IInitGridConfig,
  bulkUpdateConfig: {} as IBulkUpdateCOnfig,
  settings: {} as ISettings,
  isAsyncRequest: false,
  errorMessage: '',
  representationName: {} as IEntityRepresentationName,
  partialSuccess: { showCount: false }
};

const initialStateMethod = {
  setSelectedField: (): void => {},
  setUpdateTo: (): void => {}
};

export const useBulkUpdate = create<IUseBulkUpdate>((set) => ({
  ...initialStateValue,
  ...initialStateMethod,
  setSelectedField: (selectedField?: IBulkUpdateField[]): void => {
    set({ selectedField: selectedField?.[0], updatedTo: { value: '' }, error: InputId.Invalid });
  },
  setUpdateTo: (updateTo: IUpdate): void => {
    set({ updatedTo: updateTo, error: InputId.Invalid });
  },
  setBulkSelectionMode: (bulkSelectionMode: IBulkSelectionMode): void => {
    set((state) => ({
      bulkSelectionMode: { ...state?.bulkSelectionMode, ...bulkSelectionMode },
      error: InputId.Invalid
    }));
  }
}));

export const getSelectedFieldValue = (): {
  updatedTo: IUpdate;
  bulkSelectionMode: IBulkSelectionMode;
  selectedField: IBulkUpdateField;
  initGridConfig: IInitGridConfig;
  bulkUpdateConfig: IBulkUpdateCOnfig;
  representationName: IEntityRepresentationName;
} => {
  const {
    bulkSelectionMode,
    updatedTo,
    selectedField,
    initGridConfig,
    bulkUpdateConfig,
    representationName
  } = useBulkUpdate.getState();
  return {
    bulkSelectionMode,
    updatedTo,
    selectedField: selectedField as IBulkUpdateField,
    initGridConfig,
    bulkUpdateConfig,
    representationName
  };
};

export const setError = (inputId: InputId, message?: string): void => {
  useBulkUpdate.setState(() => ({ error: inputId, errorMessage: message }));
};

export const setGridConfig = async (config: IInitGridConfig): Promise<void> => {
  useBulkUpdate.setState(() => ({ initGridConfig: config }));

  useBulkUpdate.setState(() => ({
    initGridConfig: config
  }));
};

export const setBulkUpdateConfig = (
  bulkUpdateConfig: IBulkUpdateCOnfig,
  representationName: IEntityRepresentationName
): void => {
  useBulkUpdate.setState(() => ({ bulkUpdateConfig, representationName }));
};

export const setIsAsyncRequest = (isAsyncRequest: boolean): void => {
  useBulkUpdate.setState(() => ({ isAsyncRequest }));
};

export const setPartialSuccessMessage = (config: IPartialSuccess): void => {
  useBulkUpdate.setState(() => ({ partialSuccess: config }));
};

export const resetBulkUpdateStore = (): void => {
  useBulkUpdate.setState(initialStateValue);
};
