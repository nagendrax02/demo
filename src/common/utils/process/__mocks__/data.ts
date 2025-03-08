const workAreaId = 27;

const processFormsData = {
  [workAreaId]: {
    Event: {
      WorkAreaId: 27,
      AdditionalData: '',
      LastEvaluatedProcess: -1
    },
    ActionOutputs: [
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
    ],
    isLoading: false
  }
};

const recursiveProcessData = {
  [workAreaId]: {
    ActionOutputs: [],
    Event: {
      LastEvaluatedProcess: -1,
      WorkAreaId: 27
    }
  }
};

export { processFormsData, recursiveProcessData };
