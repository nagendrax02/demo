interface IListsSettingsConfigurations {
  BulkLeadUpdateSettings?: string;
  BulkProcessConfiguration?: string;
  BulkUpdateLeadsInListLimit?: string;
  DisableDeleteLeadsinList?: string;
  EnableESSForLeadManagement?: string;
  EnableNLeadsFeature?: string;
  IsEmailCategoryMandatory?: string;
  IsLargeTenant?: string;
  ['TMP_EnableLeadTypeListRelatedChanges']?: string;
}

interface IActionSummary {
  isFailure: boolean;
  successCount: number;
  failureCount: number;
  failureList: string[];
  actionType: string;
}

const enum ShowListType {
  SHOW = 'SHOW',
  HIDE = 'HIDE'
}

export { ShowListType };

export type { IListsSettingsConfigurations, IActionSummary };
