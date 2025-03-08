import { IReturnResponse } from 'apps/entity-details/entity-action/add-to-list/add-to-list.types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { ReactNode } from 'react';

interface IAssociatedLeadDropdown {
  entityId: string;
  handleSelection: (options: IReturnResponse[]) => void;
  selectedValues?: IOption[];
  selectedLeadsArray?: Record<string, string>[];
  doNotSetDropdownValue?: boolean;
  removedLeadsArray?: string[];
}

interface IFetchOptions {
  searchValue?: string;
  entityId: string;
  selectedLeadsArray?: Record<string, string>[];
  setOptionArrayLength: React.Dispatch<React.SetStateAction<number>>;
  removedLeadsArray?: string[];
}

interface IFetchOptionsResponse {
  RecordCount: number;
  Leads: ILead[];
}

interface ILead {
  LeadPropertyList: ILeadPropertyList[];
}

interface ILeadPropertyList {
  Attribute: string;
  Value: null | string;
  Fields: null;
}

interface IGetAugmentedLeadsArray {
  ProspectID?: string;
  ProspectAutoId?: string;
  FirstName?: string;
  LastName?: string;
  EmailAddress?: string;
  Phone?: string;
  StatusReason?: string;
  DoNotEmail?: string;
  DoNotCall?: string;
  OwnerId?: string;
  CreatedBy?: string;
  ModifiedBy?: string;
  ModifiedOn?: string;
  EngagementScore?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ProspectActivityId_Max?: string;
  IsPrimaryContact?: string;
  RelatedCompanyId?: string;
  CompanyTypePluralName?: string;
  RelatedCompanyOwnerId?: string;
  Company?: string;
  Website?: string;
  OwnerIdName?: string;
  ProspectStage?: string;
  Total?: string;
  IsStarredLead?: string;
  IsTaggedLead?: string;
  CanUpdate?: string;
  PCreatedByEmail?: string;
  PModifiedByEmail?: string;
  POwnerEmail?: string;
  Mobile?: string;
}

interface IResponseOption {
  value: string;
  label: string;
  text?: string;
  category?: null;
  isDefault?: boolean;
  customComponent?: ReactNode;
  metaData?: Record<string, string>;
}

export type {
  IFetchOptionsResponse,
  IFetchOptions,
  ILead,
  IGetAugmentedLeadsArray,
  IResponseOption,
  IAssociatedLeadDropdown
};
