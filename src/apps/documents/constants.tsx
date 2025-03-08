import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IColumnDef } from '@lsq/nextgen-preact/grid/grid.types';
import { DocumentType, IDocument } from './documents.types';
import DocumentName from './components/documents-grid/cell-renderer/Name';
import ModifiedBy from './components/documents-grid/cell-renderer/ModifiedBy';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import ModifiedOn from './components/documents-grid/cell-renderer/ModifiedOn';
import { EntityType } from 'common/types';

export const documentsColDefs: IColumnDef<IDocument>[] = [
  {
    id: 'AttachmentName',
    displayName: 'Name',
    width: 200,
    CellRenderer: DocumentName
  },
  {
    id: 'AttachmentTo',
    displayName: 'Attached to',
    width: 200
  },
  {
    id: 'ModifiedOn',
    displayName: 'Modified On',
    width: 200,
    CellRenderer: ModifiedOn
  },
  {
    id: 'ModifiedByName',
    displayName: 'Modified By',
    width: 200,
    CellRenderer: ModifiedBy
  }
];

export const bulkActions: IMenuItem[] = [
  {
    label: 'Download',
    value: 'download'
  }
];

export const documentTypes: Record<number, string> = {
  [DocumentType.ProspectNote]: 'Note',
  [DocumentType.Prospect]: 'Lead',
  [DocumentType.ProspectActivity]: 'Custom Activity',
  [DocumentType.OpportunityActivity]: 'Opportunity Activity',
  [DocumentType.RevenueActivity]: 'Sales Activity'
};

export const sourceFilterOptionMap: Record<string, IOption[]> = {
  [EntityType.Lead]: [
    {
      label: 'Attachments',
      value: 'attachment'
    },
    {
      label: 'Custom Field Set Files',
      value: 'customfieldset'
    }
  ],
  [EntityType.Opportunity]: [
    {
      label: 'Opportunity',
      value: 'Opportunity'
    },
    {
      label: 'Lead',
      value: 'Lead'
    },
    {
      label: 'Activities',
      value: 'Activities'
    }
  ]
};

export const imageTypeFilters = ['png', 'jpg', 'jpeg', 'bmp'];
export const pdfTypeFilters = ['pdf'];
export const docTypeFilters = ['doc', 'docx', 'xls', 'xlsx', 'csv'];

export const fileTypeFilterOptions: IOption[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Image',
    value: 'image'
  },
  {
    label: 'PDF',
    value: 'pdf'
  },
  {
    label: 'Document',
    value: 'document'
  }
];

export const fileTypeFilterMap: Record<string, string[] | string> = {
  all: '',
  image: imageTypeFilters,
  pdf: pdfTypeFilters,
  document: docTypeFilters
};

export const gridKey = 'documents';
