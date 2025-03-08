interface IResponse {
  ProspectID: string;
  ProspectAutoId: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  DoNotEmail: string;
  Total: string;
  CanUpdate: string;
}

interface ISelectedLeadFilterOption {
  label: string;
  value: string;
  data?: string;
}

export type { IResponse, ISelectedLeadFilterOption };
