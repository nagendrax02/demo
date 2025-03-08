import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import React from 'react';

export enum EntityShareAccessType {
  View = 1,
  Modify = 2
}

export interface ILeadShareRecord {
  Id: string;
  RequestId: string;
  UserId: string;
  EntityId: string;
  EntityContextId: string;
  EntityShareRequestType: number;
  EntityShareAccessType: EntityShareAccessType;
  EntityShareEntityAccessType: number;
  EntityShareStatus: number;
  Message: string;
  Timestamp: string;
  RequestType: string;
  Total: number;
  OrgId: string;
  Status: string;
  AccessType: string;
  EntityAccessType: string;
  UserName: string;
}

export interface ILeadShareStore {
  status: IOption;
  loading: boolean;
  usersList: IOption[];
  selectedUser: IOption;
  records: ILeadShareRecord[];
  usersMap?: Record<string, string>;
}

export interface IResponse {
  Logs: ILeadShareRecord[];
  TotalCount: number;
}

export enum EntityShareStatus {
  RequestReceived = 0,
  RequestProcessingStarted = 1,
  RequestProcessingFailedValidationFailure = 2,
  RequestProcessingValidationComplete = 3,
  RequestNotProcessingSimilarRequestExists = 4,
  RequestProcessing = 5,
  RequestProcessedSuccessfully = 6,
  RequestProcessedButFailed = 7,
  StatusUnavailable = 8
}

export interface ILeadShareDetails {
  data: ILeadShareRecord;
  failedState: boolean;
  setActivityId: React.Dispatch<React.SetStateAction<string>>;
}

export interface IShareDetail {
  DurationInMinutes?: number;
  ContextEntityId?: string;
  Area?: string;
}

export enum Status {
  All = 0,
  Processing,
  Completed,
  Failed
}
