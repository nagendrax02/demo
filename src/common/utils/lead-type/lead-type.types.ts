export interface ILeadTypeConfig {
  LeadTypeId: string;
  Name: string;
  InternalName: string;
  PluralName: string;
  IsDefault: boolean;
  FieldConfiguration: string;
  LeadGridConfiguration: string;
  LeadStageConfiguration: string | null;
  Status?: string;
}
