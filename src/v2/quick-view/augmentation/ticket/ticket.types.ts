export interface ITicket {
  Id: string;
  Key: string;
  Title: string;
  Description: string | null;
  Channel: string | null;
  Owner: string;
  Status: string;
  LeadName: string | null;
  LeadEmail: string | null;
  LeadPhone: string | null;
  IsParent: string;
  IsMerged: string;
  IsEscalated: string;
  IsReopened: string;
  IsChild: string;
  IsNew: string;
  EntityType: string;
  LeadId: string;
  ResolutionTime: string;
  [key: string]: unknown;
}
