interface IProcessActionExecutorDisplayProperty {
  DisplayName: string;
  BackgroundColor: string;
  FontColor: string;
}

interface IProcessActionExecutorSuccessMessageProperty {
  IsEnabled: boolean;
  SuccessMessage: string;
  SuccessMessageFontColor: string;
  SuccessText: string;
  SuccessTextFontColor: string;
}

interface IDisplayProperty {
  DisplayName: string;
  FontColor: string;
  BackgroundColor: string;
}

interface IProcessActionButtonProperty {
  Id: string;
  Name: string;
  Type: string;
  IsEnabled: boolean;
  DisplayProperty: IDisplayProperty;
}

interface IEvents {
  PreSubmission: {
    ApiUrl: string;
    CustomHeaders?: {
      Key: string;
      Value: string;
    };
    HookType: number;
    LappName?: string;
    LappToken?: string;
  };
}

export interface IProcessActionExecutorResponse {
  ExecutionId?: string;
  ActionId?: string;
  ProcessDesignerId?: string;
  ProcessAutoId?: number;
  DisplayProperty?: IProcessActionExecutorDisplayProperty | null;
  SuccessMessageProperty?: IProcessActionExecutorSuccessMessageProperty | null;
  ActionButtonProperty?: IProcessActionButtonProperty[] | null;
  PreSubmissionEvent?: IEvents;
  HasFurtherAction?: boolean;
}
