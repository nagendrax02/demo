export interface IField {
  SchemaName: string;
  Value: string;
  DisplayName: string;
  Fields: IField[];
  DataType: string;
}

export interface IFormData {
  InvocationSource: string;
  OpportunityFields: IField[];
  LeadFields: IField[];
  RuleSequenceNo: string | number;
  RuleExecutionTime: string;
  RuleAdvanceSearchCondition: string[];
  ConditionOperator: string;
}

export interface IOpportunityFieldsRenderer {
  DisplayName: string;
  Value: string | JSX.Element;
  DataType: string;
  ShowInForm: boolean;
}
