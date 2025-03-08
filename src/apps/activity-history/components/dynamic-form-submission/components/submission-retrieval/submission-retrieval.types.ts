import { ActivityBaseAttributeDataType, DataType } from 'common/types/entity/lead';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';

interface IField {
  leadDetails?: Record<string, string | null>;
  entityId?: string;
  DataType: DataType | ActivityBaseAttributeDataType;
  DisplayName: string;
  RuleAppliedInfo: {
    Hidden: number;
    Mandatory: number;
  };
  SchemaName: string;
  Value: string;
  SubFields?: {
    DataType: DataType | ActivityBaseAttributeDataType;
    DisplayName: string;
    RuleAppliedInfo: {
      Hidden: number;
      Mandatory: number;
    };
    SchemaName: string;
    Value: string;
  }[];
}
interface ITaskField {
  Fields: IField[];
  TaskTypeName: string;
  ReasonForFailure?: string;
  SubmissionStatus?: boolean;
  TaskTypeId?: string;
  TaskId?: string;
}

interface IActivityField {
  Fields: IField[];
  DisplayName: string;
  ActivityId?: string;
  ReasonForFailure?: string;
  SubmissionStatus?: boolean;
}

interface IOpportunityField {
  Fields: IField[];
  DisplayName: string;
  ActivityId?: string;
  ReasonForFailure?: string;
  SubmissionStatus?: boolean;
}

interface ISubmitRetrievalData {
  FormEntity: {
    ActivityFields: IActivityField[];
    LeadFields: IField[];
    OpportunityFields: IActivityField[];
    TaskFields: ITaskField[];
    PreviewS3Id?: string;
    LeadSubmissionStatus?: boolean;
    CapturedFrom?: string;
    LeadSaveResponse?: string;
  };
  SubmissionFormName: string;
  IsStatusEnabledInDFS: boolean;
}

export enum StatusType {
  Success = 'Success',
  Failure = 'Failure'
}

export interface ISubmissionStatusConfig {
  showStatus: boolean;
  type?: StatusType;
  title?: string;
  reason?: string;
}

export interface ICapturedFromConfig {
  showIcon: boolean;
  source: string;
}

interface INormalizedSubmissionRetrievalData {
  title: string;
  fields: IAugmentedAttributeFields[];
  type: string;
  entityId?: string;
  submissionStatusConfig?: ISubmissionStatusConfig;
}

export type {
  IField,
  ITaskField,
  IActivityField,
  IOpportunityField,
  ISubmitRetrievalData,
  INormalizedSubmissionRetrievalData
};
