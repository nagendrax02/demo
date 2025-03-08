enum OperationStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

interface ICancelResponse {
  Status?: OperationStatus;
  Message?: {
    Id?: string;
  };
}

export type { ICancelResponse };

export { OperationStatus };
