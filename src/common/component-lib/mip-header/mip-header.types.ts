interface IMiPHeader {
  title: string;
  id: string;
  icon: string;
  dataTestId: string;
  canHide?: boolean;
  doNotAct?: boolean;
}

enum Module {
  INVALID = '',
  LeadDetails = 'LeadDetails',
  SmartViews = 'SmartViews',
  OpportunityDetails = 'OpportunityDetails',
  AccountDetails = 'AccountDetails',
  ManageTasks = 'ManageTasks',
  ManageLeads = 'ManageLeads',
  ManageLists = 'ManageLists',
  ManageListLeads = 'ManageListLeads',
  ManageActivities = 'ManageActivities'
}

enum ActionId {
  Back = 'back',
  GiveFeedback = 'giveFeedback',
  SwitchBack = 'switchBack'
}

export { Module, ActionId };
export type { IMiPHeader };
