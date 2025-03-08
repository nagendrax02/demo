import { IDocument } from '../documents.types';

export const mockData: IDocument[] = [
  {
    AttachmentName: 'ank_activity',
    AttachmentFileURL: '',
    DocumentType: 'Custom Activity',
    CreatedOn: '2023-12-14 06:25:10',
    ModifiedOn: '2023-12-14 06:25:10',
    ModifiedByName: 'Rishabh Admin',
    Description: '',
    Id: '0',
    id: '0',
    ChildProspectDetailsDocumentsList: [
      {
        ParentId: '0',
        Id: 'cfs1',
        id: 'cfs1',
        AttachmentName: 'ank: File',
        FieldSchema: 'mx_Custom_2',
        CFSSchema: 'mx_CustomObject_111',
        FieldDisplayName: 'ank',
        FileName: '434eb0dc.pdf'
      }
    ],
    RelatedObjectId: '',
    Type: 4,
    AttachmentTo: '',
    ShowPlayIcon: false,
    RestrictDownload: false,
    UsePreSignedURL: false,
    ModifiedByEmail: ''
  },
  {
    id: '1',
    AttachmentName: '6.jpg',
    AttachmentFileURL: '',
    DocumentType: '',
    AttachmentTo: '',
    CreatedOn: '2023-12-19 09:06:37',
    ModifiedOn: '2023-12-19 09:06:37',
    ModifiedByName: 'ankit36407',
    Description: 'file-description',
    Id: '1',
    ChildProspectDetailsDocumentsList: [],
    RelatedObjectId: 'lead-id',
    Type: 3,
    ShowPlayIcon: false,
    RestrictDownload: false,
    UsePreSignedURL: false,
    ModifiedByEmail: ''
  },
  {
    id: '2',
    AttachmentName: '4.jpg',
    AttachmentFileURL: '',
    DocumentType: '',
    AttachmentTo: '',
    CreatedOn: '2023-12-19 09:06:37',
    ModifiedOn: '2023-12-19 09:06:37',
    ModifiedByName: 'ankit36407',
    Description: 'file-2',
    Id: '2',
    ChildProspectDetailsDocumentsList: [],
    RelatedObjectId: 'lead-2',
    Type: 0,
    ShowPlayIcon: false,
    RestrictDownload: false,
    UsePreSignedURL: false,
    ModifiedByEmail: ''
  }
];

export const testFileData = {
  Files: [
    {
      FileUrl:
        'https://test-leadattachment.s3.ap-south-1.amazonaws.com/t/S_ed/content/module/lead/72553bf8-0e36-49ea-a035-965cd4e4fbcc/01590463.jpeg',
      FileName: '6.jpeg'
    }
  ],
  ZipFolderName: '6.jpeg'
};
