import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IEntityIds } from '../entity-details/types/entity-store.types';

export interface IDocument {
  Id: string;
  id: string;
  AttachmentFileURL: string;
  AttachmentName: string;
  AttachmentTo: string;
  ModifiedByName: string;
  CreatedOn: string;
  RelatedObjectId: string;
  ChildProspectDetailsDocumentsList: IChildProspectDetailsDocumentsList[];
  ModifiedOn: string;
  Type: DocumentType;
  DocumentType: string;
  RestrictDownload: boolean;
  ShowPlayIcon: boolean;
  Description?: string;
  ModifiedByEmail?: string;
  UsePreSignedURL?: boolean;
  EntityIds?: IEntityIds;
  RestrictDelete?: boolean;
}

export interface IChildProspectDetailsDocumentsList {
  Id: string;
  id: string;
  ParentId: string;
  FieldSchema: string;
  CFSSchema: string;
  AttachmentName: string;
  FieldDisplayName: string;
  FileName: string;
  checkPermissionForPreview?: (id: string) => Promise<boolean>;
}

export enum DocumentType {
  ProspectCustomAcivity = 0,
  RevenueActivity,
  ProspectActivity,
  ProspectNote,
  Prospect,
  OpportunityActivity,
  CFS
}

export interface IDocumentStore {
  search: string;
  source: IOption;
  isLoading?: boolean;
  isDataLoaded: boolean;
  records: IDocument[];
  searchedRecords: IDocument[];
  fileTypeFilter: IOption;
}

export interface IFileConfig {
  EntityId: string;
  DataSource: number;
  FieldSchema?: string;
  CFSSchema?: string;
  FileUrl?: string;
  FileName?: string;
  UsePreSignedUrl?: boolean;
}

export interface IDocumentsExpandable {
  record: IDocument;
  entityIds: IEntityIds;
  selectedItems: Record<string, IDocument>;
}
