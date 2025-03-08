import { EntityType } from 'common/types';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { CallerSource } from 'common/utils/rest-client';
import { IEntityDetailsCoreData } from '../../types/entity-data.types';

interface ISelectedOption {
  value: string;
  label: string;
}

interface IChangeStage {
  entityType: EntityType;
  stageValue: string | undefined;
  setDisabledSave?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
  selectedOption: {
    value: string;
    label: string;
  }[];
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
  config: IConfig | undefined;
  setCommentsOptions: React.Dispatch<React.SetStateAction<IOption[]>>;
  commentsOptions: IOption[];
  showError: boolean;
  entityDetailsCoreData: IEntityDetailsCoreData;
}

interface IOptionSet {
  label: string;
  options: IResponseOption[];
}

interface IResponse {
  SchemaName: null;
  Options: IResponseOption[];
  OptionSet: IOptionSet[];
}

interface IResponseOption {
  value: string;
  label: string;
  text?: string;
  category?: null;
  isDefault?: boolean;
}

enum ConfigType {
  Dropdown = 'DROPDOWN',
  TextArea = 'TEXTAREA'
}

interface IConfig {
  Label?: string;
  IsMandatory?: boolean;
  Type?: ConfigType;
  Options?: string;
  MinimumWordsRequired?: string;
  MaxLength?: number;
  MinLength?: number;
  showCommentBox?: boolean;
  SchemaName?: string;
}

type ChangeStageData = Record<string, string | IConfig | null | number>;

interface IGetConfig {
  setConfig: React.Dispatch<React.SetStateAction<IConfig | undefined>>;
  setCommentsOptions: React.Dispatch<React.SetStateAction<IOption[]>>;
  callerSource: CallerSource;
}

interface IGetChangeStatusStageConfig {
  setConfig: React.Dispatch<React.SetStateAction<IConfig | undefined>>;
  callerSource: CallerSource;
  eventCode?: number;
}

interface IFetchCommentsOptions {
  config: IConfig | undefined;
}

export type {
  IChangeStage,
  IResponse,
  IResponseOption,
  ISelectedOption,
  IConfig,
  ChangeStageData,
  IGetConfig,
  IFetchCommentsOptions,
  IGetChangeStatusStageConfig
};
export { ConfigType };
