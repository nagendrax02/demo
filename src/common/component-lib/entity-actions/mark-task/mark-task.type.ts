export interface IMarkOpenResponse {
  Message: { AffectedRows: number };
  Status: string;
}

export interface IMarkTaskProps {
  taskIds: string[];
  taskActionType: TaskActionType;
  handleClose: () => void;
  onSuccess?: () => void;
  setGridMask?: React.Dispatch<React.SetStateAction<boolean>>;
  task?: Record<string, string | null>;
}

export enum TaskActionType {
  OPEN,
  COMPLETE
}
