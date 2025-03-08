import { ActionId, Module } from '../mip-header.types';

const LEAD_DETAILS_FEEDBACK = {
  REASONS: [
    {
      id: 1,
      title: 'Feature Missing',
      value: 'Feature Missing'
    },
    {
      id: 2,
      title: 'Feature Not Working',
      value: 'Feature Not Working'
    },
    {
      id: 3,
      title: 'Slow Loading',
      value: 'Slow Loading'
    },
    {
      id: 5,
      title: 'Unable to Understand',
      value: 'Unable to Understand'
    },
    {
      id: 7,
      title: 'No Issues',
      value: 'No Issues',
      hideWorkArea: true,
      unSupportedAction: []
    }
  ],
  WORK_AREAS: [
    {
      id: 1,
      title: 'Activity History Tab',
      value: 'Activity History Tab'
    },
    {
      id: 2,
      title: 'Calling',
      value: 'Calling'
    },
    {
      id: 4,
      title: 'Forms',
      value: 'Forms'
    },
    {
      id: 6,
      title: 'Tasks',
      value: 'Tasks'
    },
    {
      id: 7,
      title: 'V-Card',
      value: 'V-Card'
    }
  ]
};

const MANAGE_LEADS_FEEDBACK = {
  REASONS: [
    {
      id: 1,
      title: 'Feature Missing',
      value: 'Feature Missing'
    },
    {
      id: 2,
      title: 'Feature Not Working',
      value: 'Feature Not Working'
    },
    {
      id: 3,
      title: 'Slow Loading',
      value: 'Slow Loading'
    },
    {
      id: 4,
      title: 'Unable to Understand',
      value: 'Unable to Understand'
    },
    {
      id: 5,
      title: 'No Issues',
      value: 'No Issues',
      hideWorkArea: true,
      unSupportedAction: []
    }
  ],
  WORK_AREAS: [
    {
      id: 2,
      title: 'Calling',
      value: 'Calling'
    },
    {
      id: 3,
      title: 'Forms',
      value: 'Forms'
    },
    {
      id: 4,
      title: 'Filters',
      value: 'Filters'
    },
    {
      id: 5,
      title: 'Advanced Search',
      value: 'Advanced Search'
    },
    {
      id: 6,
      title: 'Import',
      value: 'Import'
    },
    {
      id: 7,
      title: 'Export',
      value: 'Export'
    }
  ]
};

const SMART_VIEWS_FEEDBACK = {
  REASONS: [
    {
      id: 1,
      title: 'Feature Missing',
      value: 'Feature Missing'
    },
    {
      id: 2,
      title: 'Feature Not Working',
      value: 'Feature Not Working'
    },
    {
      id: 3,
      title: 'Slow Loading',
      value: 'Slow Loading'
    },
    {
      id: 4,
      title: 'Unable To Understand',
      value: 'Unable To Understand'
    },
    {
      id: 5,
      title: 'No Issues',
      value: 'No Issues',
      hideWorkArea: true,
      unSupportedAction: []
    }
  ],
  WORK_AREAS: [
    {
      id: 1,
      title: 'Refresh',
      value: 'Refresh'
    },
    {
      id: 2,
      title: 'Search',
      value: 'Search'
    },
    {
      id: 3,
      title: 'Filters',
      value: 'Filters'
    },
    {
      id: 4,
      title: 'Calling',
      value: 'Calling'
    },
    {
      id: 5,
      title: 'Email',
      value: 'Email'
    },
    {
      id: 6,
      title: 'Forms',
      value: 'Forms'
    },
    {
      id: 7,
      title: 'Table Data',
      value: 'Table Data'
    },
    {
      id: 8,
      title: 'Smart View Actions',
      value: 'Smart View Actions'
    },
    {
      id: 9,
      title: 'Add New Tab',
      value: 'Add New Tab'
    }
  ]
};

const OPPORTUNITY_DETAILS_FEEDBACK = {
  REASONS: [
    {
      id: 1,
      title: 'Feature Missing',
      value: 'Feature Missing'
    },
    {
      id: 2,
      title: 'Feature Not Working',
      value: 'Feature Not Working'
    },
    {
      id: 3,
      title: 'Slow Loading',
      value: 'Slow Loading'
    },
    {
      id: 4,
      title: 'Unable to Understand',
      value: 'Unable to Understand'
    },
    {
      id: 5,
      title: 'No Issues',
      value: 'No Issues',
      hideWorkArea: true,
      unSupportedAction: []
    }
  ],
  WORK_AREAS: [
    {
      id: 2,
      title: 'Activity History Tab',
      value: 'Activity History Tab'
    },
    {
      id: 3,
      title: 'Calling',
      value: 'Calling'
    },
    {
      id: 4,
      title: 'Forms',
      value: 'Forms'
    },
    {
      id: 5,
      title: 'Tasks',
      value: 'Tasks'
    },
    {
      id: 6,
      title: 'V-Card',
      value: 'V-Card'
    }
  ]
};

const MANAGE_TASKS_FEEDBACK = {
  REASONS: [
    {
      id: 1,
      title: 'Feature Missing',
      value: 'Feature Missing'
    },
    {
      id: 2,
      title: 'Feature Not Working',
      value: 'Feature Not Working'
    },
    {
      id: 3,
      title: 'Slow Loading',
      value: 'Slow Loading'
    },
    {
      id: 4,
      title: 'Unable to Understand',
      value: 'Unable to Understand'
    },
    {
      id: 5,
      title: 'No Issues',
      value: 'No Issues',
      hideWorkArea: true,
      unSupportedAction: []
    }
  ],
  WORK_AREAS: [
    {
      id: 1,
      title: 'Search',
      value: 'Search'
    },
    {
      id: 2,
      title: 'Filters',
      value: 'Filters'
    },
    {
      id: 3,
      title: 'Calendar View',
      value: 'Calendar View'
    },
    {
      id: 4,
      title: 'Forms',
      value: 'Forms'
    },
    {
      id: 5,
      title: 'Export',
      value: 'Export'
    },
    {
      id: 6,
      title: 'Row Actions',
      value: 'Row Actions'
    },
    {
      id: 7,
      title: 'Table Data',
      value: 'Table Data'
    },
    {
      id: 8,
      title: 'Other',
      value: 'Other'
    }
  ]
};

const headerTitle = {
  [ActionId.SwitchBack]: 'Thank you for trying!'
};

const reasonTitle = {
  [ActionId.SwitchBack]: 'Please specify the reason for switching back'
};

const primaryButton = {
  [ActionId.SwitchBack]: 'Submit'
};

const successMessage = {
  [ActionId.SwitchBack]: 'Feedback submitted successfully'
};

const REASONS = {
  [Module.LeadDetails]: LEAD_DETAILS_FEEDBACK.REASONS,
  [Module.SmartViews]: SMART_VIEWS_FEEDBACK.REASONS,
  [Module.OpportunityDetails]: OPPORTUNITY_DETAILS_FEEDBACK.REASONS,
  [Module.AccountDetails]: OPPORTUNITY_DETAILS_FEEDBACK.REASONS,
  [Module.ManageTasks]: MANAGE_TASKS_FEEDBACK.REASONS,
  [Module.ManageLeads]: MANAGE_LEADS_FEEDBACK.REASONS
};
const WORK_AREAS = {
  [Module.LeadDetails]: LEAD_DETAILS_FEEDBACK.WORK_AREAS,
  [Module.SmartViews]: SMART_VIEWS_FEEDBACK.WORK_AREAS,
  [Module.OpportunityDetails]: OPPORTUNITY_DETAILS_FEEDBACK.WORK_AREAS,
  [Module.AccountDetails]: OPPORTUNITY_DETAILS_FEEDBACK.WORK_AREAS,
  [Module.ManageTasks]: MANAGE_TASKS_FEEDBACK.WORK_AREAS,
  [Module.ManageLeads]: MANAGE_LEADS_FEEDBACK.WORK_AREAS
};

export { primaryButton, headerTitle, successMessage, REASONS, WORK_AREAS, reasonTitle };
