interface IListDetails {
  CreatedBy: string;
  CreatedByEmail: string;
  CreatedByName: string;
  CreatedOn: string;
  Definition: string | null;
  Description: string;
  ID: string;
  InternalName: string | null;
  ListType: number;
  MemberCount: number;
  ModifiedBy: string;
  ModifiedByEmail: string;
  ModifiedByName: string;
  ModifiedOn: string;
  Name: string;
  LeadType?: string;
}

export type { IListDetails };
