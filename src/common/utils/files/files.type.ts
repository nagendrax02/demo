interface IFiles {
  FileUrl: string;
  FileName: string;
}

interface IFileInfo {
  Files: IFiles[];
  ZipFolderName: string;
}

interface IDocumentsToFetch {
  EntityId: string | null;
  DataSource: FileDataSource;
  FieldSchema: string;
  CFSSchema: string;
}

enum FileDataSource {
  CFS = 6
}

export type { IFiles, IFileInfo, IDocumentsToFetch };
export { FileDataSource };
