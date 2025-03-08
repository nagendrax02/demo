import { ActionRenderType } from 'apps/entity-details/types';
import { PROCESS_BUTTON } from '../actions/constant';
import { IActionMenuItem } from 'src/apps/entity-details/types/entity-data.types';

const commonActionData = {
  id: 'Opportunity',
  title: 'Opportunity',
  type: ActionRenderType.Button,
  sequence: 2,
  renderAsIcon: false,
  workAreaId: 44,
  isLoading: false,
  actionHandler: {}
};

const moreActions = [
  {
    label: 'Edit',
    value: 'Edit',
    workAreaConfig: { workAreaId: 28 }
  }
] as IActionMenuItem[];

const subMenu = [
  {
    label: '0e9wew',
    value: '7bed4609-666c-11ee-ab2c-02eefa84bd20'
  },
  {
    label: '2878 SF',
    value: '8523395a-2f5c-473b-88e0-a9ea33306692'
  }
] as IActionMenuItem[];

const convertedButtonActionsTwoForms = [
  {
    ...commonActionData,
    subMenu
  }
];

const convertedMoreAction = [
  {
    label: 'Edit',
    value: 'Edit',
    workAreaConfig: { workAreaId: 28 },
    subMenu
  }
] as IActionMenuItem[];

const quickAction = {
  name: 'leadEdit',
  icon: 'edit',
  workAreaId: 73,
  onClick: (): void => {}
};

const ActionOutputs = [
  {
    Entity: {
      DisplayProperty: {
        DisplayName: 'B'
      }
    },
    ProcessId: 'e0271499-4699-11ee-886c-02eefa84bd20'
  },
  {
    Entity: {
      DisplayProperty: {
        DisplayName: 'A'
      }
    },
    ProcessId: 'a6924260-f208-4e91-bcb5-4b490b51d619'
  }
];

const convertedQuickAction = {
  ...quickAction,
  subMenu
};

const processFormsData = {
  [commonActionData.workAreaId]: {
    Event: {
      WorkAreaId: commonActionData.workAreaId,
      AdditionalData: '',
      LastEvaluatedProcess: -1
    },
    ActionOutputs
  },
  [quickAction.workAreaId]: {
    Event: {
      WorkAreaId: quickAction.workAreaId,
      AdditionalData: '',
      LastEvaluatedProcess: -1
    },
    ActionOutputs
  }
};

const processFormsDataForActivity = {
  [PROCESS_BUTTON.workAreaConfig.workAreaId]: {
    ActionOutputs: [],
    Event: {
      LastEvaluatedProcess: -1,
      WorkAreaId: PROCESS_BUTTON.workAreaConfig.workAreaId
    }
  }
};

const processFormsDataForSingleForm = {
  [PROCESS_BUTTON.workAreaConfig.workAreaId]: {
    ActionOutputs: ActionOutputs.splice(0, 1),
    Event: {
      LastEvaluatedProcess: -1,
      WorkAreaId: PROCESS_BUTTON.workAreaConfig.workAreaId
    }
  },
  [moreActions[0].workAreaConfig?.workAreaId || 0]: {
    ActionOutputs: ActionOutputs.splice(0, 1),
    Event: {
      LastEvaluatedProcess: -1,
      WorkAreaId: moreActions[0].workAreaConfig?.workAreaId
    }
  },
  [quickAction.workAreaId]: {
    ActionOutputs: ActionOutputs.splice(0, 1),
    Event: {
      LastEvaluatedProcess: -1,
      WorkAreaId: quickAction.workAreaId
    }
  }
};

export {
  convertedButtonActionsTwoForms,
  commonActionData,
  moreActions,
  convertedMoreAction,
  convertedQuickAction,
  quickAction,
  processFormsData,
  processFormsDataForActivity,
  processFormsDataForSingleForm,
  subMenu
};
