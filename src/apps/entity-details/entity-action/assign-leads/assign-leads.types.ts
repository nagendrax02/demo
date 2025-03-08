interface IAssignLeads {
  handleClose: () => void;
  accountId: string;
  accountType: string;
}

interface IAssignedLeadsCols {
  id: string;
  leadName: string;
  emailAddress: string;
  stage: string;
  owner: string;
}

interface IAssignLeadsStore {
  leadRecords: IAssignedLeadsCols[];
  setLeadRecords: (data: IAssignedLeadsCols[]) => void;
  resetAssignLeadsStore: () => void;
  selectedLeadsArray: Record<string, string>[];
  setSelectedLeadsArray: (data: Record<string, string>[]) => void;
  showLeadGrid: boolean;
  setShowLeadGrid: (data: boolean) => void;
  disabledSave: boolean;
  setDisabledSave: (data: boolean) => void;
  isLoading: boolean;
  setIsLoading: (data: boolean) => void;
  removedLeadsArray: string[];
  setRemovedLeadsArray: (data: string[]) => void;
}

export type { IAssignLeads, IAssignedLeadsCols, IAssignLeadsStore };
