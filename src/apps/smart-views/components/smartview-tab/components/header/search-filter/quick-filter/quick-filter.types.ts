import { IOption } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown/dropdown.types';
import { IFilterData } from '../../../../smartview-tab.types';

export interface IQuickFilterResponse {
  CreatedBy?: string;
  CreatedByName?: string;
  CreatedOn?: string;
  CreatedOnString?: string;
  Definition: string;
  ID: string;
  InternalName?: string;
  IsSystemGenerated?: boolean;
  ModifiedBy?: string;
  ModifiedByName?: string;
  ModifiedOn?: string;
  ModifiedOnString?: string;
  Name: string;
  OwnerID?: string;
  OwnerIdName?: string;
  SQLDefinition?: string | null;
  SimplifiedSQLDefinition?: null;
  Total?: number;
}

export type IQuickFilterOption = IOption<IQuickFilterResponse>;

export interface IStarredLeadFilters {
  selectedFilters: string[];
  bySchemaName: {
    [key: string]: IFilterData;
  };
}

export interface ICustomOption {
  option: IQuickFilterResponse;
  handleDelete: (item: IQuickFilterResponse) => void;
  handleEdit: (item: IQuickFilterResponse) => void;
}

export interface IEditQuickFilter {
  itemSelected: IQuickFilterResponse | undefined;
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  leadTypeInternalName: string | undefined;
}

export interface IAdvanceSearch {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IShowEditQuickFilter {
  itemSelected: IQuickFilterResponse | undefined;
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  leadTypeInternalName: string | undefined;
}

export interface IShowDeleteModal {
  setShowDelete: (
    value: React.SetStateAction<{
      showDeleteModal: boolean;
      itemDeleteSuccessFully: boolean;
    }>
  ) => void;
  showDelete: {
    showDeleteModal: boolean;
    itemDeleteSuccessFully: boolean;
  };
  itemSelected: IQuickFilterResponse | undefined;
  handleRecordDelete: () => Promise<void>;
  loading: boolean;
}
