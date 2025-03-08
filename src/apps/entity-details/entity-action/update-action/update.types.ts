import {
  IAugmentedEntity,
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from '../../types/entity-data.types';

export interface IGridConfig {
  pageSize: number;
  isSelectAll: boolean;
  totalRecords: number;
  totalPages: number;
}

export interface ISearchParams {
  advancedSearchText: string;
  searchText: string;
}
interface IUpdate {
  entityId: string[];
  handleClose: () => void;
  actionType: string;
  entityDetailsCoreData: IEntityDetailsCoreData;
  required?: boolean;
  onSuccess?: () => void;
  customConfig?: Record<string, string>;
  gridConfig?: IGridConfig;
  searchParams?: ISearchParams;
}

enum OperationStatus {
  SUCCESS = 'Success',
  ERROR = 'Error',
  FAILURE = 'Failure'
}

interface IResponse {
  OperationMessage: string;
  OperationStatus: OperationStatus;
  SuccessCount: number;
  Status?: OperationStatus;
  FailureCount?: number;
  IsAsyncRequest?: boolean;
  UpdateStatus?: string;
}

interface IGetFieldsValues {
  selectedOption: { label: string; value: string }[];
  comments: string;
  schemaName: string;
}

interface IGetBody extends IGetFieldsValues {
  leadId: string[];
}

interface IField {
  Key: string;
  Value: string;
}

interface IBodyResponse {
  LeadIds: string[];
  LeadFields: IField[];
  LeadRetrieveCriteria: null;
  UpdateAll: boolean;
  Nleads: number;
}

interface IAccountBodyResponse {
  CompanyIds: string[];
  CompanyTypeId: string;
  Stage?: string;
  OwnerId?: string;
}

export interface IActivityField {
  ColumnName: string;
  ColumnValue: string;
}

interface IOppBodyPayload {
  ActivityEventCode: number;
  ActivityFields: IActivityField[];
  ActivityIds: string[];
  IsOpportunity: boolean;
  IsStatusUpdate: boolean;
  UpdateAll: boolean;
  ActivitySearchParams?: string;
  SearchText?: string;
}

interface IModalBody {
  leadRepresentationName: IEntityRepresentationName;
  actionType: string;
  compRender: {
    [x: string]: JSX.Element;
  };
  showError: boolean;
  getBodyTitle?: {
    [x: string]: string;
  };
  required?: boolean;
  selectedSchema?: string;
  directRenderComponent?: boolean;
  sendCalenderInvite: boolean;
  entityDetailsCoreData: IEntityDetailsCoreData;
  setSendCalenderInvite: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEntityCount?: number;
}

interface IRenderUpdate extends IModalBody {
  handleClose: () => void;
  handleApiCall: () => Promise<void>;
  isLoading: boolean;
  disabledSave: boolean;
  showError: boolean;
  directRenderComponent?: boolean;
  entityDetailsCoreData: IEntityDetailsCoreData;
  sendCalenderInvite: boolean;
  setSendCalenderInvite: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEntityCount?: number;
  isAsyncReq?: boolean;
}

interface IUpdateStore {
  augmentedEntityProperty: IAugmentedEntity;
  selectedOption: {
    value: string;
    label: string;
  }[];
  actionType: string;
}

interface IHandleSetConfig extends IUpdateStore {
  setAugmentedEntityData: (data: IAugmentedEntity) => void;
}

interface IHandleApiResponse {
  response: IResponse;
  handleSuccessNotification: () => void;
  augmentedEntityProperty: IAugmentedEntity;
  selectedOption: {
    value: string;
    label: string;
  }[];
  setAugmentedEntityData: (data: IAugmentedEntity) => void;
  actionType: string;
  handleErrorNotification: (data: OperationStatus) => void;
  onSuccess?: () => void;
}

export type {
  IUpdateStore,
  IHandleSetConfig,
  IUpdate,
  IResponse,
  IGetFieldsValues,
  IGetBody,
  IBodyResponse,
  IField,
  IModalBody,
  IRenderUpdate,
  IHandleApiResponse,
  IOppBodyPayload,
  IAccountBodyResponse
};

export { OperationStatus };
