import { IConfig } from '../change-stage/change-stage.types';
import { EntityType } from 'src/common/types';
import { IGridConfig } from '../update-action/update.types';
import { IEntityRepresentationName } from '../../types/entity-data.types';

export interface IChangeStatusStage {
  eventCode: number;
  bodyTitle: string;
  setStatus: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
  status: {
    value: string;
    label: string;
  }[];
  setStage: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
  stage: {
    value: string;
    label: string;
  }[];
  statusError: boolean;
  setStatusError: React.Dispatch<React.SetStateAction<boolean>>;
  stageError: boolean;
  setStageError: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messageError: boolean;
  setMessageError: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  entityDetailsType: EntityType;
  primaryEntityRepName: IEntityRepresentationName;
  config?: IConfig;
  gridConfig?: IGridConfig;
  setUpdateAllPageRecord?: (data: boolean) => void;
  updateAllPageRecord?: boolean;
}
