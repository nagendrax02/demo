import { IActionConfig } from 'apps/entity-details/types';
import { IActionWrapperItem } from 'common/component-lib/action-wrapper';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { IEntityRepresentationName } from 'apps/entity-details/types/entity-data.types';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

interface IProcessEvent {
  WorkAreaId: number;
  AdditionalData?: string;
  LastEvaluatedProcess?: number;
}

interface IProcessPayload {
  triggerType: number;
  applicationType: number;
  Events: IProcessEvent[];
}

interface IProcessActionOutput {
  ActionId: string;
  ProcessAutoId: number;
  ProcessId: string;
  Entity: {
    FormId: string;
    DisplayProperty: {
      DisplayName: string;
      FontColor: string;
      BackgroundColor: string;
    };
    FormName: string;
    ActionButtonProperty: [
      {
        Id: string;
        Name: string;
        Type: string;
        IsEnabled: boolean;
        DisplayProperty: {
          DisplayName: string;
          FontColor: string;
          BackgroundColor: string;
        };
      }
    ];
    Events: {
      PreSubmission: {
        HookType: number;
        ApiUrl: string;
      };
    };
    ProcessAutoId: number;
    ActionId: string;
    OpportunityCode?: string;
    SuccessMessageProperty?: {
      IsEnabled: boolean;
      SuccessMessage: string;
      SuccessMessageFontColor: string;
      SuccessText: string;
      SuccessTextFontColor: string;
    };
  };
  ActionType: string;
  Success: boolean;
  CurrentActionOutput: string;
  IsDynamicAction: boolean;
  IsFurtherActionExists: boolean;
}

interface IProcessResponse {
  Event?: IProcessEvent;
  ActionOutputs?: IProcessActionOutput[];
}

interface IProcessFormsData {
  [workAreaKey: string]: IProcessResponse;
}

interface IWorkAreaConfig {
  workAreaId: number;
  additionalData?: string;
  fallbackAdditionalData?: string;
}

interface IGeneratePayloadConfig {
  workAreaIds: number | number[];
  lastEvaluatedProcess?: number;
  additionalData?: string;
}

type IConvertToProcessAction = <T>(
  action: T & IActionWrapperItem,
  processFormsData: IProcessFormsData
) => T & IActionWrapperItem;

interface IUseProcessOutput {
  processFormsData: IProcessFormsData | null;
  convertToProcessAction: IConvertToProcessAction;
}

interface IProcessMenuItem extends IMenuItem {
  formId?: string;
}

interface IUpdateActionList {
  item: IActionConfig;
  record: IRecordType & Record<string, string>;
  repName?: IEntityRepresentationName;
  leadTypeInternalNameForProcess?: string;
  isEssTenantEnabled?: boolean;
}

export type {
  IProcessPayload,
  IProcessResponse,
  IGeneratePayloadConfig,
  IProcessFormsData,
  IConvertToProcessAction,
  IProcessEvent,
  IProcessActionOutput,
  IUseProcessOutput,
  IWorkAreaConfig,
  IProcessMenuItem,
  IUpdateActionList
};
