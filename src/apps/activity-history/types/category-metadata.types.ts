interface IActivityCategoryMetadata {
  EntityType?: number;
  Text: string;
  Value: string;
  EventType: number;
  Category: string;
  Selected: boolean;
  CategoryOrder: number;
  HideInActivityGrid?: boolean;
  AllowAttachments?: true;
  PluralName?: string;
  EventDirection?: number;
}

export type { IActivityCategoryMetadata };
