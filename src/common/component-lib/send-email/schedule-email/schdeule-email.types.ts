import { CallerSource } from 'src/common/utils/rest-client';

interface IEmailCols {
  id: string;
  subjectName: string;
  scheduledOn: string;
  scheduledBy: string;
  leadId: string;
  cancelledAction: (id: string) => void;
}

interface IResponse {
  ID: string;
  Subject: string;
  ScheduledOn: string;
  ScheduledOnTimeZone: string;
  CreatedBy: string;
  CreatedByName: string;
  RecipientCount: number;
}

export enum ScheduleType {
  LIST = 6,
  OTHER = 4
}

interface IScheduleEmail {
  handleClose: () => void;
  leadId: string;
  leadRepresentationName: string;
  leadName: string;
  callerSource: CallerSource;
  type?: number;
}

enum OperationStatus {
  SUCCESS = 'Success',
  ERROR = 'Error'
}

interface ICancelResponse {
  Status?: OperationStatus;
  ExceptionType?: string;
}

export type { IEmailCols, IScheduleEmail, IResponse, ICancelResponse };

export { OperationStatus };
