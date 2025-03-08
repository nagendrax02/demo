import { EntityType } from 'common/types';

interface IAutomationReport {
  entityType: EntityType;
  handleClose: () => void;
  entityId: string;
  representationName: string;
}

interface IReportGrid {
  entityId: string;
  entityType: EntityType;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  representationName: string;
}

interface IReportCols {
  id: string;
  reportName: string;
  triggeredOn: string;
  securedParams: string;
  level: number;
}

interface IResponse {
  Reports: IReport[];
  TotalCount: number;
}

export interface IReport {
  ParentActionId: string;
  ParentProcessDefinitionId: string;
  TotalCount: number;
  SecuredParams: string;
  Name: string;
  EntityType: number;
  EntityId: string;
  ProcessDefinitionId: number;
  ProcessExecutionHistoryId: number;
  CreatedOn: Date;
  CreatedOnString: Date;
  Level?: number;
  Children?: IReport[];
  IsChild?: boolean;
}

export enum ParentActionID {
  Na = 'NA'
}

export type { IAutomationReport, IReportGrid, IReportCols, IResponse };
