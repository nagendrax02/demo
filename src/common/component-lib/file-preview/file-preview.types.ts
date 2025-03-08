import { IFileInfo } from 'src/common/utils/files';

interface IPreviewData {
  name: string;
  previewUrl: string;
  description?: string;
  key?: string;
  type?: string;
  fileData?: IFileInfo;
  restrictDownload?: boolean;
}

enum FileTypes {
  Image = 'Image',
  Pdf = 'Pdf',
  Audio = 'Audio',
  Video = 'Video'
}

export type { IPreviewData };
export { FileTypes };
