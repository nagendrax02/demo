import { IPaginationConfig } from '@lsq/nextgen-preact/grid/grid.types';
import { IEntityRepresentationName } from '../../types/entity-data.types';
import { IBulkSelectionMode } from 'common/component-lib/bulk-update/bulk-update.store';
import {
  IBulkAction,
  IFetchCriteria
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { InputId } from 'common/component-lib/bulk-update/bulk-update.types';

interface IAddToList {
  entityIds?: string[];
  handleClose: () => void;
  customConfig?: Record<string, string | null>;
  leadRepresentationName: IEntityRepresentationName;
  pageConfig?: IPaginationConfig;
  fetchCriteria?: IFetchCriteria;
  bulkAction?: IBulkAction | null;
  tabId?: string;
  handleSuccess?: () => void;
  leadTypeInternalName?: string;
}

type Response = Record<string, string>;

interface IReturnResponse {
  value: string;
  label: string;
  dataType?: DataType;
  augmentedLabel?: JSX.Element | string;
}

enum DataType {
  SearchableDropdown = 'SearchableDropdown'
}

const INTERNAL_LIST = {
  STARRED_LEADS: 'Starred Leads',
  ALL_LEADS: 'AllLeadsList'
};
export const INTERNAL_LIST_TRANSLATION_KEY = {
  [INTERNAL_LIST.STARRED_LEADS]: 'STARRED_LEADS',
  [INTERNAL_LIST.ALL_LEADS]: 'ALL_LEADS'
};

export const CREATE_NEW_FIELD = 'CREATE_NEW_FIELD';

export const INTERNAL_LIST_SCHEMA = [INTERNAL_LIST.ALL_LEADS, INTERNAL_LIST.STARRED_LEADS];

interface ICreateNewList {
  createNewListSelected: boolean;
  setCreateNewListSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelection: (options: IReturnResponse[]) => void;
}

export const CREATE_NEW_LIST = {
  value: 'create_new_list',
  label: 'Create New List'
};

enum OperationStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

enum ExceptionType {
  MXDuplicateEntryException = 'MXDuplicateEntryException',
  MXDuplicateEntityNameException = 'MXDuplicateEntityNameException',
  MXXSSException = 'MXXSSException'
}

interface ILocalizationMergeDatum {
  NameSpace?: string;
  Value: string;
}
interface IData {
  LocalizationMergeData: ILocalizationMergeDatum[];
  Code: number;
}

interface IResponse {
  ListId?: string;
  Status?: OperationStatus;
  ExceptionType?: ExceptionType;
  ExceptionMessage?: string;
  Data?: string[] | IData;
  OperationMessage?: string;
  OperationStatus?: OperationStatus;
  SuccessCount?: number;
  RequestId?: string;
  IsAsyncRequest?: boolean;
}

interface IBody {
  leadIds: string[];
  selectedOption: string;
  listName: string;
  message: string;
  fetchCriteria?: IFetchCriteria;
  bulkSelectionMode?: IBulkSelectionMode;
  settingConfig?: ISettingConfig;
  leadTypeInternalName?: string;
}

interface IInvokeApi {
  leadIds: string[];
  selectedValue: string;
  listName: string;
  message: string;
  fetchCriteria?: IFetchCriteria;
  bulkSelectionMode: IBulkSelectionMode;
  settingConfig: ISettingConfig;
  leadTypeInternalName?: string;
}

interface IConfig {
  isSelectAll: boolean;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

interface ISettingConfig {
  BulkLeadUpdateCount: string;
  EnableNLeadsFeature: string;
  MaxNLeadsToUpdateInSync: string;
}

interface IModifySearchParams {
  LeadSearchParams: {
    SearchText: string;
    AdvancedSearchText: string;
    AdvancedSearchTextNew: string;
    LeadOnlyConditions: string;
  };
}

interface IBulkAddToListConfig {
  pageConfig?: IPaginationConfig;
  handleModeSelection: (value: IBulkSelectionMode) => void;
  config: IConfig;
  settingConfig: ISettingConfig;
  bulkSelectionMode: IBulkSelectionMode;
  isAsyncRequest: boolean;
  bulkNLeadError: InputId | undefined;
}

interface IAddToListModal {
  handleClose: () => void;
  leadRepresentationName: IEntityRepresentationName;
  selectedOption: {
    value: string;
    label: string;
  }[];
  showError: {
    dropdown: boolean;
    listName: boolean;
    errorMsg: string;
  };
  createNewListSelected: boolean;
  setCreateNewListSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelection: (options: IReturnResponse[]) => void;
  listName: string;
  handleListNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleApiCall: () => Promise<void>;
  message: string;
  disabledSave: boolean;
  bulkAddToListConfig: IBulkAddToListConfig;
  leadTypeInternalName?: string;
}

interface IHandleList {
  selectedValue: string;
  leadIds: string[];
  listName: string;
  message: string;
  body: Record<string, string | number | boolean | string[] | object | undefined>;
  fetchCriteria?: IFetchCriteria;
  bulkSelectionMode?: IBulkSelectionMode;
  settingConfig?: ISettingConfig;
  leadTypeInternalName?: string;
}

interface IIsBulkActionValid {
  settingConfig: ISettingConfig;
  allRecordSelected?: boolean;
  config: IConfig;
  bulkSelectionMode?: IBulkSelectionMode;
  showAlert: (notification: INotification) => void;
  setBulkNLeadError: React.Dispatch<React.SetStateAction<InputId | undefined>>;
}

interface IAPIBody {
  SearchText?: string;
  PageSize: string;
  PageIndex: number;
  ListType: number;
  SortColumn: string;
  SortOrder: number;
  LeadType?: string;
}

export type {
  IAPIBody,
  IAddToList,
  Response,
  IReturnResponse,
  ICreateNewList,
  IResponse,
  IBody,
  IInvokeApi,
  IAddToListModal,
  IHandleList,
  IModifySearchParams,
  IIsBulkActionValid,
  IConfig
};

export { DataType, OperationStatus, ExceptionType };
