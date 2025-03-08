export interface IUploadFileResponse {
  relativeFilePath: string;
  s3FilePath: string;
  uploadedFile: string;
}

export interface INotesItem {
  ProspectNoteId: string;
  RelatedProspectId: string;
  Note: string;
  AttachmentName: string;
  CreatedBy: string;
  CreatedByName: string;
  CreatedOn: string;
  ModifiedBy: string;
  ModifiedByName: string;
  ModifiedOn: string;
  Description?: string;
  Id?: string;
}

export interface INotesResponse {
  RecordCount: number;
  List: INotesItem[];
}

export interface IDate {
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface IFileStorageConfig {
  blockedExtensions: string[] | undefined;
  allowedMaxSize: string;
  allowedExtensions: string[];
}
